// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\server\controller\skillsController.js
const Skills = require("../models/ProjectsSehema").Skills; // Corrected import path
const asyncHandler = require('express-async-handler'); // Optional: for cleaner async error handling

// Get all skills
const getAllSkills = asyncHandler(async (req, res) => {
    const skills = await Skills.find({});
    // It's good practice to check if skills were found, though an empty array is often acceptable
    if (!skills || skills.length === 0) {
        // You might want to return 200 with an empty array or 404 if no skills MUST exist
        return res.status(200).json([]); // Return empty array if none found
    }
    res.status(200).json(skills);
})

// Create a new skill
const createSkill = asyncHandler(async (req, res) => {
    const { skillName, skillDescription, skillIcons } = req.body; // skillIcons is received here

    // Basic validation
    if (!skillName || !skillDescription || !skillIcons) {
        return res.status(400).json({ message: 'Missing required fields: skillName, skillDescription, and skillIcons are required.' });
    }

    // Optional: Check if skill already exists (by name, for example)
    const skillExists = await Skills.findOne({ skillName });
    if (skillExists) {
        return res.status(409).json({ message: `Skill with name '${skillName}' already exists.` });
    }

    // Create new skill instance
    const newSkill = new Skills({
        skillName,
        skillDescription,
        skillIcons // And used here to create the new skill document
    });

    // Save the skill to the database
    const savedSkill = await newSkill.save();

    res.status(201).json({ message: 'Skill created successfully', skill: savedSkill });
});

// Delete A skills
const deleteSkill = asyncHandler(async (req, res) => { 
    const {skillId} =req.params;
    if(!skillId) {
        return res.status(400).json({message: 'Skill Id is required'})
    }
    const skill  =await Skills.findById(skillId);
    if(!skill) {
        return res.status(404).json({message: 'Skill not found'})
    }
    await Skills.findByIdAndDelete(skillId);
    res.status(200).json({message: 'Skill deleted successfully',skill})

 });

// Update A skills
const updateSkill = asyncHandler(async (req, res) => { 
    const { skillId } = req.params;
    const { skillName, skillDescription, skillIcons } = req.body;

    // Validate skillId
    if (!skillId) {
        return res.status(400).json({ message: 'Skill ID is required' });
    }

    // Basic validation for request body
    if (!skillName && !skillDescription && !skillIcons) {
        return res.status(400).json({ message: 'At least one field to update is required: skillName, skillDescription, or skillIcons.' });
    }

    try {
        const skill = await Skills.findById(skillId);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Update fields if they are provided in the request body
        if (skillName) skill.skillName = skillName;
        if (skillDescription) skill.skillDescription = skillDescription;
        if (skillIcons) skill.skillIcons = skillIcons; // Assuming skillIcons is a direct replacement

        const updatedSkill = await skill.save();

        res.status(200).json({ message: 'Skill updated successfully', skill: updatedSkill });

    } catch (error) {
        // Handle potential errors, e.g., CastError for invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Skill ID format' });
        }
        console.error("Error in updateSkill:", error);
        // Pass error to the next error-handling middleware if you have one
        // For now, sending a generic 500 error
        res.status(500).json({ message: 'Failed to update skill' });
    }
});


// Export the functions
module.exports = {
    getAllSkills,
    createSkill ,// Add the new function here
    deleteSkill,
    updateSkill, // Export the new update function
};
