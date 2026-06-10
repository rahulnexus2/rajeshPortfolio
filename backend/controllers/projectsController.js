import Project from '../models/Project.js';

// Get all projects sorted by order
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ displayOrder: 1 });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving projects', error: error.message });
  }
};

// Create project
export const createProject = async (req, res) => {
  try {
    const { title, description, image, technologies, githubUrl, liveUrl, featured } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const lastProject = await Project.findOne().sort({ displayOrder: -1 });
    const nextOrder = lastProject ? lastProject.displayOrder + 1 : 0;

    const newProject = new Project({
      title,
      description,
      image,
      technologies: Array.isArray(technologies) ? technologies : [],
      githubUrl,
      liveUrl,
      featured: !!featured,
      displayOrder: nextOrder
    });

    await newProject.save();
    return res.status(201).json({ message: 'Project created successfully!', project: newProject });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, technologies, githubUrl, liveUrl, featured, displayOrder } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (image !== undefined) project.image = image;
    if (technologies !== undefined) project.technologies = Array.isArray(technologies) ? technologies : [];
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (featured !== undefined) project.featured = !!featured;
    if (displayOrder !== undefined) project.displayOrder = displayOrder;

    await project.save();
    return res.status(200).json({ message: 'Project updated successfully!', project });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json({ message: 'Project deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};

// Reorder projects
export const reorderProjects = async (req, res) => {
  try {
    const { projectIds } = req.body;
    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ message: 'Invalid payload, expected array of project IDs' });
    }

    const bulkOps = projectIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { displayOrder: index }
      }
    }));

    await Project.bulkWrite(bulkOps);
    return res.status(200).json({ message: 'Projects reordered successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error reordering projects', error: error.message });
  }
};
