import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import PortfolioSettings from './models/PortfolioSettings.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';

// Setup environment configs
dotenv.config();

const skillsData = [
  // Frontend
  { skillName: 'React', icon: 'FaReact', category: 'Frontend', proficiency: 90 },
  { skillName: 'JavaScript', icon: 'FaJs', category: 'Frontend', proficiency: 95 },
  { skillName: 'HTML5', icon: 'FaHtml5', category: 'Frontend', proficiency: 90 },
  { skillName: 'CSS3', icon: 'FaCss3Alt', category: 'Frontend', proficiency: 85 },
  // Backend
  { skillName: 'Node.js', icon: 'FaNodeJs', category: 'Backend', proficiency: 88 },
  { skillName: 'Express.js', icon: 'SiExpress', category: 'Backend', proficiency: 85 },
  // Database
  { skillName: 'MongoDB', icon: 'FaDatabase', category: 'Database', proficiency: 80 },
  { skillName: 'MySQL', icon: 'SiMysql', category: 'Database', proficiency: 75 },
  // Programming Languages
  { skillName: 'Python', icon: 'SiPython', category: 'Programming Languages', proficiency: 70 },
  { skillName: 'Java', icon: 'SiJava', category: 'Programming Languages', proficiency: 75 },
  // Other
  { skillName: 'Git & GitHub', icon: 'FaCode', category: 'Other', proficiency: 90 }
];

const projectsData = [
  {
    title: 'AI Chatbot Integration',
    description: 'An intelligent chatbot assistant integrated with OpenAI API and Node.js backend. Built with standard MERN architecture and Framer Motion animations.',
    technologies: ['React', 'Express', 'Node.js', 'MongoDB', 'OpenAI'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com',
    featured: true,
    displayOrder: 0
  },
  {
    title: 'Portfolio Website CMS',
    description: 'A high-end developer portfolio with inline CRUD editing tools, static media file managers, drag and drop reordering, and visits tracking metrics.',
    technologies: ['React', 'Express', 'MongoDB', 'Framer Motion', 'Tailwind CSS'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com',
    featured: true,
    displayOrder: 1
  },
  {
    title: 'Task Scheduler & Planner',
    description: 'A collaborative scrum card board manager utilizing clean layouts, dragging events, backend validations, and real-time JWT authorizations.',
    technologies: ['React', 'Express', 'MongoDB', 'JWT'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com',
    featured: false,
    displayOrder: 2
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rajesh_portfolio_cms';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully!');

    // 1. Seed Portfolio Settings
    const settingsCount = await PortfolioSettings.countDocuments();
    if (settingsCount === 0) {
      console.log('No portfolio settings found. Seeding default biography details...');
      await PortfolioSettings.create({
        name: 'Rajesh Rautela',
        title: 'Full Stack Developer',
        tagline: 'Building scalable web applications using MERN Stack and Artificial Intelligence.',
        profileImage: '',
        resumeUrl: '',
        aboutHeading: 'Full Stack AI Developer',
        aboutDescription: 'Full Stack AI Developer interested in MERN Stack and Artificial Intelligence. Specialized in developing robust, scalable backends alongside interactive, animated frontend applications.',
        careerObjective: 'To leverage modern technologies, AI integrations, and dynamic architectures to build next-generation web platforms that solve real-world problems.',
        location: 'New Delhi, India',
        email: 'rajesh@example.com',
        phone: '+91 9876543210',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com'
      });
      console.log('Portfolio settings seeded successfully.');
    } else {
      console.log('Portfolio settings already exist. Skipping settings seed.');
    }

    // 2. Seed Skills
    const skillsCount = await Skill.countDocuments();
    if (skillsCount === 0) {
      console.log('No skills found. Seeding default technology stack...');
      const bulkSkills = skillsData.map((skill, index) => ({
        ...skill,
        displayOrder: index
      }));
      await Skill.insertMany(bulkSkills);
      console.log(`Successfully seeded ${skillsData.length} skills!`);
    } else {
      console.log(`${skillsCount} skills already exist. Skipping skills seed.`);
    }

    // 3. Seed Projects
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      console.log('No projects found. Seeding default case studies...');
      await Project.insertMany(projectsData);
      console.log(`Successfully seeded ${projectsData.length} projects!`);
    } else {
      console.log(`${projectsCount} projects already exist. Skipping projects seed.`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
