const Projects = require("../models/ProjectsSehema").Projects; // Import the Projects model
const multer = require("multer");
const path = require("path");
const asyncHandler = require("express-async-handler");
const validator = require('validator'); // For data validation
// Multer setup for handle file uploads
const fs = require('fs'); // Import the 'fs' module for file system operations

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: fileFilter
});

// create project

const createProjects = async (req, res, next) => {
    // Use fields to handle both single and multiple images
    const uploadFields = upload.fields([
        { name: 'projectMultiImages', maxCount: 20 } // Multiple images field
    ]);

    uploadFields(req, res, async (err) => {
        console.log('createProject - req.files:', req.files);
        console.log('createProject - req.body:', req.body);

        if (err) {
            console.error('createProject - multer error:', err);
            return next(err);
        }

        try {
            // Check if required fields are present
            const requiredFields = ['projectName', 'projectDescription', 'projectGitHubLink', 'projectLiveLink', 'projectTechStack', 'projectFeatures'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ message: `Missing required field: ${field}` });
                }
            }
            // Handle multiple images
            const projectMultiImages = req.files['projectMultiImages'] ? req.files['projectMultiImages'].map(file => file.path) : [];
            const projectMultiImageUrls = projectMultiImages.map(file => `http://localhost:${process.env.PORT}/${file}`);

            const newProjectData = {
                projectName: req.body.projectName,
                projectDescription: req.body.projectDescription,
                projectMultiImages: projectMultiImageUrls, // Store all multiple image URLs
                projectGitHubLink: req.body.projectGitHubLink,
                projectLiveLink: req.body.projectLiveLink,
                projectTechStack: req.body.projectTechStack,
                projectFeatures: req.body.projectFeatures,
            };
            // Create a Mongoose model instance
            const newProject = new Projects(newProjectData);
            const createdProject =  await newProject.save();

            res.status(201).json(createdProject);
            console.log('createProject - project created successfully:', createdProject);

        } catch (error) {
            console.error('createProject - Database error:', error);
            next(error);
        }
    });
};


// get project
const getproject = async (req, res, next) => {
  try {
    const getAllproject = await Projects.find();
    if(getAllproject.length===0){
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json({ message: "All projects retrieved successfully", projects: getAllproject });
  } catch (error) {
    console.error("Error in getproject:", error);
    res.status(500).json({ message: "Failed to retrieve projects" });
    next(error);
  }
};

// delete project
// const deleteProject = async (req, res, next) => {
//   try {
//     const { projectId } = req.params;
//     const deletedProject = await Projects.findByIdAndDelete(projectId);
   
    
//     if (!deletedProject) {
//       return res.status(404).json({ message: "Project not found" });
//     }
//     res.status(200).json({ message: "Project deleted successfully" ,deletedProject});

//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete project" });
//     next(error);
//   }
// }
// delete project
const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    // Find the project to get the image paths before deleting
    const project = await Projects.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete the project from the database
    const deletedProject = await Projects.findByIdAndDelete(projectId);

    // Delete associated image files
    if (project.projectMultiImages && project.projectMultiImages.length > 0) {
      project.projectMultiImages.forEach(imageUrl => {
        // Construct the correct path to the uploads directory
        const imageFileName = path.basename(imageUrl);
        const imagePath = path.join(__dirname, '..', 'uploads', imageFileName);

        console.log(`Attempting to delete image: ${imageUrl} at path: ${imagePath}`); // Log the path

        // Check if the file exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Error deleting image: ${imagePath}`, err);
            } else {
              console.log(`Deleted image: ${imagePath}`);
            }
          });
        } else {
          console.warn(`Image not found: ${imagePath}`); // Log if the file doesn't exist
        }
      });
    }

    res.status(200).json({ message: "Project deleted successfully", deletedProject });

  } catch (error) {
    console.error("Error in deleteProject:", error);
    res.status(500).json({ message: "Failed to delete project" });
    next(error);
  }
};

// get singleProject
const getSingleProject = async (req, res, next) => {
  try {
    const { projectId } = req.params; // Consistent parameter name
    const project = await Projects.findById(projectId); // Use 'project' as the variable name

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project retrieved successfully", project }); // Use 'project' as the key
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid project ID" }); // 400 for invalid ID
    }
    console.error("Error in getSingleProject:", error);
    res.status(500).json({ message: "Failed to retrieve project" });
    next(error);
  }
};

// update project
const updateProject = async (req, res, next) => {
  const uploadFields = upload.fields([
      { name: 'projectMultiImages', maxCount: 10 } // Multiple images field
  ]);

  uploadFields(req, res, async (err) => {
      if (err) {
          console.error('updateProject - multer error:', err);
          return next(err);
      }
      try {
          const { projectId } = req.params;

          // Check if the project exists
          const existingProject = await Projects.findById(projectId);
          if (!existingProject) {
              return res.status(404).json({ message: "Project not found" });
          }

          // Validate the request body
          const { projectName, projectDescription, projectGitHubLink, projectLiveLink, projectTechStack, projectFeatures } = req.body;
          if (!projectName || !projectDescription || !projectGitHubLink || !projectLiveLink || !projectTechStack || !projectFeatures) {
              return res.status(400).json({ message: "All fields are required" });
          }

          // Handle multiple images
          const projectMultiImages = req.files['projectMultiImages'] ? req.files['projectMultiImages'].map(file => file.path) : [];
          const projectMultiImageUrls = projectMultiImages.map(file => `http://localhost:${process.env.PORT}/${file}`);

          // Delete old images if new ones are uploaded
          if (projectMultiImageUrls.length > 0) {
              if (existingProject.projectMultiImages && existingProject.projectMultiImages.length > 0) {
                  existingProject.projectMultiImages.forEach(imageUrl => {
                      const imageFileName = path.basename(imageUrl);
                      const imagePath = path.join(__dirname, '..', 'uploads', imageFileName);

                      if (fs.existsSync(imagePath)) {
                          fs.unlink(imagePath, (err) => {
                              if (err) {
                                  console.error(`Error deleting image: ${imagePath}`, err);
                              } else {
                                  console.log(`Deleted image: ${imagePath}`);
                              }
                          });
                      } else {
                          console.warn(`Image not found: ${imagePath}`);
                      }
                  });
              }
          }

          const updatedProjectData = {
              projectName: projectName,
              projectDescription: projectDescription,
              projectMultiImages: projectMultiImageUrls.length > 0 ? projectMultiImageUrls : existingProject.projectMultiImages, // Store all multiple image URLs
              projectGitHubLink: projectGitHubLink,
              projectLiveLink: projectLiveLink,
              projectTechStack: projectTechStack,
              projectFeatures: projectFeatures,
          };

          // Update the project
          const updatedProject = await Projects.findByIdAndUpdate(projectId, updatedProjectData, { new: true });

          res.status(200).json({ message: "Project updated successfully", updatedProject });
      } catch (error) {
          console.error("Error in updateProject:", error);
          if (error.name === 'CastError') {
              return res.status(400).json({ message: "Invalid project ID" });
          }
          res.status(500).json({ message: "Failed to update project" });
          next(error);
      }
  });
};



module.exports = { createProjects,getproject ,deleteProject,getSingleProject, updateProject};
