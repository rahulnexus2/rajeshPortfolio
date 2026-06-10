import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { FaBars, FaTimes, FaChartBar, FaSignOutAlt, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAdmin, editMode, toggleEditMode, logout } = useAdmin();
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      if (isDashboardPage) return;

      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDashboardPage]);

  const navItems = [
    { name: 'Home', href: 'home' },
    { name: 'About', href: 'about' },
    { name: 'Skills', href: 'skills' },
    { name: 'Projects', href: 'projects' },
    { name: 'Contact', href: 'contact' },
  ];

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (isDashboardPage) {
      navigate('/', { replace: true });
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-950/70 backdrop-blur-md border-white/5 shadow-lg shadow-indigo-950/10' 
        : 'bg-slate-950/30 backdrop-blur-sm border-transparent'
    }`}>
      {/* Subtle Scroll Progress Indicator on Navbar bottom border */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Branding */}
          <div className="flex-shrink-0">
            <span 
              onClick={() => handleNavClick('home')}
              className="text-xs font-bold uppercase tracking-widest text-slate-100 cursor-pointer hover:text-white transition-colors flex items-center gap-2 font-display"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse" />
              Rajesh Rautela
            </span>
          </div>

          {/* Desktop Nav links */}
          {!isDashboardPage ? (
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative py-1.5 px-3.5 text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 hover:text-slate-100 ${
                    activeSection === item.href ? 'text-slate-100' : 'text-slate-400'
                  }`}
                >
                  {activeSection === item.href && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-slate-900/60 border border-white/5 rounded-lg -z-10 shadow-glow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-[10px] font-bold tracking-wider uppercase text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <FaEye size={11} /> Portfolio
              </Link>
            </div>
          )}

          {/* Admin Tools (Desktop) */}
          {isAdmin && (
            <div className="hidden md:flex items-center space-x-3 border-l border-white/5 pl-4">
              {!isDashboardPage ? (
                <>
                  <button
                    onClick={toggleEditMode}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                      editMode 
                        ? 'bg-slate-100 text-[#030712] hover:bg-slate-200' 
                        : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/10 hover:text-slate-250'
                    }`}
                  >
                    {editMode ? 'Edit On' : 'Edit Off'}
                  </button>
                  <Link
                    to="/admin/messages"
                    className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/10 hover:text-slate-250 flex items-center gap-1 transition-all"
                  >
                    <FaChartBar size={9} /> Console
                  </Link>
                </>
              ) : (
                <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20 font-bold uppercase tracking-wider">
                  Console Mode
                </span>
              )}
              
              <button
                onClick={() => {
                  logout();
                  if (isDashboardPage) navigate('/');
                }}
                className="text-slate-500 hover:text-rose-400 transition-colors pl-1"
                title="Logout Session"
              >
                <FaSignOutAlt size={12} />
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-4">
            {isAdmin && !isDashboardPage && (
              <button
                onClick={toggleEditMode}
                className={`p-1.5 rounded-lg transition-colors ${
                  editMode ? 'text-slate-100' : 'text-slate-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${editMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              </button>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel with Slide transition */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-slate-950/95 backdrop-blur-md border-b border-white/5 px-4 py-4 space-y-4 shadow-xl overflow-hidden"
          >
            {!isDashboardPage ? (
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 rounded-xl transition-colors ${
                      activeSection === item.href 
                        ? 'text-white bg-slate-900 border border-white/5' 
                        : 'text-slate-400 hover:bg-slate-900/30'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider py-1.5 px-2.5 rounded-lg block"
                >
                  View Portfolio
                </Link>
              </div>
            )}

            {/* Mobile Admin Controls */}
            {isAdmin && (
              <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                {!isDashboardPage && (
                  <button
                    onClick={() => {
                      toggleEditMode();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      editMode ? 'bg-slate-100 text-[#030712]' : 'bg-slate-900 text-slate-400 border border-white/5'
                    }`}
                  >
                    {editMode ? 'Disable Edit' : 'Enable Edit'}
                  </button>
                )}
                
                <Link
                  to={isDashboardPage ? '/' : '/admin/messages'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-slate-400 border border-white/5 text-center flex items-center justify-center gap-2 hover:text-white"
                >
                  {isDashboardPage ? <FaEye size={11} /> : <FaChartBar size={11} />}
                  {isDashboardPage ? 'View Portfolio' : 'Admin Console'}
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    if (isDashboardPage) navigate('/');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-950/25 text-rose-400 border border-rose-900/30 flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt size={11} /> Logout Session
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
