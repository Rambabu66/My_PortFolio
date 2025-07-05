const exprinceDetails = require("../models/ExperienceSchema").experince;
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const createExperience = asyncHandler(async (req, res) => {
  const { Title, Company, city, state, Years, Description } = req.body; // Added city, state; removed Location
  // Updated validation
  if (!Title || !Company || !city || !state || !Years) {
    return res
      .status(400)
      .json({
        message:
          "Missing required fields: Title, Company, city, state, and Years are required.",
      });
  }

  const newExperince = new exprinceDetails({
    Title,
    Company,
    city, // Added city
    state, // Added state
    Years,
    Description, // Description is optional as per schema, Mongoose handles if undefined
  });
  const saveExperince = await newExperince.save();
  res.status(200).json({
    message: "Experience added successfully",
    experincedata: saveExperince,
  });
});

// getExperince
const getExperince = asyncHandler(async (req, res) => {
  const experince = await exprinceDetails.find();
  res.status(200).json(experince);
});

// updateExperince
const updateExperince = asyncHandler(async (req, res) => {
  const { experinceId } = req.params;
  const { Title, Company, city, state, Years, Description } = req.body; // Added city, state; removed Location

  // Validate experinceId presence and format
  if (!mongoose.Types.ObjectId.isValid(experinceId)) {
       return res.status(400).json({ message: "Invalid Experience ID format." });
  }
  // Check if at least one field is provided for update
  // This means if all potential update fields are falsy (undefined, null, empty string, etc.)
  if (!Title && !Company && !city && !state && !Years && !Description) {

    return res
      .status(400)
      .json({
        message:
          "At least one field to update is required: Title, Company, city, state, Years, or Description.",
      });
  }
 
  try {
    const experince = await exprinceDetails.findById(experinceId);
    if (!experince) {
      return res.status(404).json({ message: "Experience not found." });
    }
    if (Title) experince.Title = Title;
    if (Company) experince.Company = Company;
    if (city) experince.city = city;
    if (state) experince.state = state;
    if (Years) experince.Years = Years;
    if (Description) experince.Description = Description;
    const updatedExperince = await experince.save();
    res
      .status(200)
      .json({
        message: "Experience updated successfully.",
        experince: updatedExperince,
      });
  } catch (error) {
    console.error("Error in updateExperince:", error);
   // Handle specific Mongoose errors if needed, e.g., ValidationError
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to update experience." });
  }
});


// deleteExperince
const deleteExperince = asyncHandler(async (req, res) => {
  const { experinceId } = req.params;
  if (!experinceId) {
    return res.status(400).json({ message: "Experince Id is required"})
  }
  const experince = await exprinceDetails.findById(experinceId);
  if(!experince) {
    return res.status(404).json({ message: "Experince not found"})

  }
  await exprinceDetails.findByIdAndDelete(experinceId)
  res.status(200).json({ message: "Experince deleted successfully",experince})
})
module.exports = { createExperience, getExperince, updateExperince, deleteExperince };
