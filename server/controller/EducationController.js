const Educationdetails = require("../models/EducationSchema").education;
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose"); // Import mongoose

const createEducationApi = asyncHandler(async (req, res) => {
  const { Stream, collegeName, city, state, years, description } = req.body;
  // Validate required fields based on schema (description is optional)
  if (!Stream || !collegeName || !city || !state || !years) {
    return res
      .status(400)
      .json({
        message:
          "Missing required fields: Stream, collegeName, city, state, and years are required.",
      });
  }
  const neweducation = new Educationdetails({
    Stream,
    collegeName,
    city,
    state,
    years,
    description, // Pass description as is; Mongoose handles if it's undefined and not required.
  });
  const saveeducation = await neweducation.save();
  res
    .status(201)
    .json({
      message: "Education details created successfully",
      education: saveeducation,
    });
});

const getEducationApi = asyncHandler(async (req, res) => {
  const education = await Educationdetails.find();
  res.status(200).json(education);
});

const deleteEducationApi = asyncHandler(async (req, res) => {
  const { educationId } = req.params;

  if (!educationId) {
    return res.status(400).json({ message: "Education Id is required" });
  }
  // Validate if educationId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    return res.status(400).json({ message: "Invalid Education ID format" });
  }

  const education = await Educationdetails.findById(educationId); // Corrected variable name
  if (!education) {
    return res.status(404).json({ message: "Education details not found" }); // Consistent message
  }
  await Educationdetails.findByIdAndDelete(educationId);

  res
    .status(200)
    .json({ message: "Education details deleted successfully" });
  // The .catch block was misplaced; express-async-handler manages errors from await.
});

const updateEducationApi = asyncHandler(async (req, res) => {
  const { educationId } = req.params;
  const { Stream, collegeName, city, state, years, description } = req.body;

  // Validate educationId format
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    return res.status(400).json({ message: "Invalid Education ID format" });
  }

  // Check if at least one field is provided for update
  if (
   !Stream || !collegeName || !city || !state || !years
  ) {
    return res
      .status(400)
      .json({
        message:
          "At least one field to update is required: Stream, collegeName, city, state, years, or description.",
      });
  }

  try {
    const education = await Educationdetails.findById(educationId);

    if (!education) {
      return res.status(404).json({ message: "Education details not found" });
    }

    // Update fields if they are provided in the request body
    if (Stream ) education.Stream = Stream;
    if (collegeName ) education.collegeName = collegeName;
    if (city ) education.city = city;
    if (state ) education.state = state;
    if (years ) education.years = years;
    if (description ) education.description = description;

    const updatedEducation = await education.save(); // Mongoose validation runs here

    res.status(200).json({ message: "Education details updated successfully", education: updatedEducation });
  } catch (error) {
    // express-async-handler will pass errors to the next error-handling middleware.
    // This catch block can be used for specific error handling if needed before that.
    console.error("Error in updateEducationApi:", error); // Log for debugging
    // For example, handling ValidationError specifically:
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    // Fallback or let global error handler manage
    res.status(500).json({ message: "Failed to update education details" });
  }
});

module.exports = { createEducationApi, getEducationApi, deleteEducationApi, updateEducationApi };
