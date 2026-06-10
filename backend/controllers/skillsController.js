import Skill from '../models/Skill.js';

// Get all skills ordered by displayOrder
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ displayOrder: 1 });
    return res.status(200).json(skills);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving skills', error: error.message });
  }
};

// Create a new skill
export const createSkill = async (req, res) => {
  try {
    const { skillName, icon, category, proficiency } = req.body;
    
    if (!skillName || !category) {
      return res.status(400).json({ message: 'Skill name and category are required' });
    }

    // Find highest displayOrder
    const lastSkill = await Skill.findOne().sort({ displayOrder: -1 });
    const nextOrder = lastSkill ? lastSkill.displayOrder + 1 : 0;

    const newSkill = new Skill({
      skillName,
      icon,
      category,
      proficiency,
      displayOrder: nextOrder
    });

    await newSkill.save();
    return res.status(201).json({ message: 'Skill added successfully!', skill: newSkill });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating skill', error: error.message });
  }
};

// Update skill details
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { skillName, icon, category, proficiency, displayOrder } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skillName !== undefined) skill.skillName = skillName;
    if (icon !== undefined) skill.icon = icon;
    if (category !== undefined) skill.category = category;
    if (proficiency !== undefined) skill.proficiency = proficiency;
    if (displayOrder !== undefined) skill.displayOrder = displayOrder;

    await skill.save();
    return res.status(200).json({ message: 'Skill updated successfully!', skill });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating skill', error: error.message });
  }
};

// Delete a skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    return res.status(200).json({ message: 'Skill deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
};

// Reorder skills (drag & drop)
export const reorderSkills = async (req, res) => {
  try {
    const { skillIds } = req.body; // Array of IDs in the new sorted order
    if (!Array.isArray(skillIds)) {
      return res.status(400).json({ message: 'Invalid payload, expected array of skill IDs' });
    }

    const bulkOps = skillIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { displayOrder: index }
      }
    }));

    await Skill.bulkWrite(bulkOps);
    return res.status(200).json({ message: 'Skills reordered successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error reordering skills', error: error.message });
  }
};
