import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { portfolioAPI, skillsAPI, projectsAPI } from './utils/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedSpotlight from './components/FeaturedSpotlight';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './pages/AdminDashboard';
import { FaSpinner } from 'react-icons/fa';

// Main Home Page Portfolio Layout Assembly
// Rearranged flow: Hero -> Featured Project Spotlight -> About -> Projects -> Skills -> Contact -> Footer
const PortfolioHome = ({ 
  portfolioData, 
  skillsData, 
  projectsData, 
  setPortfolioData, 
  setSkillsData, 
  setProjectsData,
  onOpenLogin
}) => {
  return (
    <>
      <Hero data={portfolioData} onUpdate={setPortfolioData} />
      <FeaturedSpotlight projectsList={projectsData} onUpdate={setProjectsData} />
      <About data={portfolioData} onUpdate={setPortfolioData} />
      <Projects projectsList={projectsData} onUpdate={setProjectsData} />
      <Skills skillsList={skillsData} onUpdate={setSkillsData} />
      <Contact data={portfolioData} onUpdate={setPortfolioData} />
      <Footer data={portfolioData} onUpdate={setPortfolioData} onOpenLogin={onOpenLogin} />
    </>
  );
};

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Fetch portfolio data from database APIs on mount
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [settings, skills, projects] = await Promise.all([
          portfolioAPI.get(),
          skillsAPI.getAll(),
          projectsAPI.getAll()
        ]);
        
        setPortfolioData(settings);
        setSkillsData(skills);
        setProjectsData(projects);
      } catch (err) {
        console.error('Failed to load portfolio database assets:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col justify-center items-center gap-4">
        <FaSpinner size={24} className="text-indigo-400 animate-spin" />
        <span className="text-[10px] font-bold text-slate-500 font-sans uppercase tracking-wider">Compiling Portfolio Database...</span>
      </div>
    );
  }

  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-[#030712] text-slate-300 flex flex-col relative">
          <div className="noise-overlay" />
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Home Portfolio View */}
              <Route 
                path="/" 
                element={
                  <PortfolioHome 
                    portfolioData={portfolioData}
                    skillsData={skillsData}
                    projectsData={projectsData}
                    setPortfolioData={setPortfolioData}
                    setSkillsData={setSkillsData}
                    setProjectsData={setProjectsData}
                    onOpenLogin={() => setLoginModalOpen(true)}
                  />
                } 
              />
              
              {/* Protected CMS Messages Dashboard */}
              <Route path="/admin/messages" element={<AdminDashboard />} />
              
              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Admin Authentication Modal Popup */}
          <AdminLoginModal 
            isOpen={loginModalOpen} 
            onClose={() => setLoginModalOpen(false)} 
          />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
