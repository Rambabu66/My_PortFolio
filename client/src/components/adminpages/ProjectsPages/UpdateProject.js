import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Image, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateProject } from "../../../features/products/projectSlice";

const UpdateProject = ({ show, onHide, project, onUpdateSuccess }) => {
  const dispatch = useDispatch();
  const initialFormData = {
    projectName: "",
    projectDescription: "",
    projectGitHubLink: "",
    projectLiveLink: "",
    projectTechStack: "",
    projectFeatures: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]); // New state for new image previews
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || "",
        projectDescription: project.projectDescription || "",
        projectGitHubLink: project.projectGitHubLink || "",
        projectLiveLink: project.projectLiveLink || "",
        projectTechStack: project.projectTechStack || "",
        projectFeatures: project.projectFeatures || "",
      });
      setExistingImages(project.projectMultiImages || []);
      // Clear any previously selected new images and their previews when a new project is loaded.
      setNewImages([]);
      setNewImagePreviews([]);
    }
    // Cleanup function for when the component unmounts or 'project' changes
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    }; // The cleanup function correctly uses the `newImagePreviews` from the closure of the effect's previous run.
  }, [project]); // Removed newImagePreviews from dependencies to prevent infinite loop.

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    // Revoke old previews before creating new ones to prevent memory leaks
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));

    const files = Array.from(e.target.files);
    setNewImages(files); // Store the actual File objects
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(previews); // Store the URLs for display
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;

    // Manual validation with toasts
    console.log("UpdateProject.js: Submitting update for project ID:", project._id);
    if (!formData.projectName.trim()) {
      toast.error("Project name is required.");
      return;
    }
    if (!formData.projectDescription.trim()) {
      toast.error("Project description is required.");
      return;
    }
    if (
      formData.projectGitHubLink &&
      !/^https:\/\/(www\.)?github\.com\//.test(formData.projectGitHubLink)
    ) {
      toast.error("Please provide a valid GitHub repository link.");
      return;
    }

    const projectUpdateData = new FormData();
    Object.keys(formData).forEach((key) => {
      projectUpdateData.append(key, formData[key]);
    });

    for (let i = 0; i < newImages.length; i++) {
      projectUpdateData.append("projectMultiImages", newImages[i]);
    }
    // Note: If newImages are provided, they are expected to replace existing ones on the backend.
    // If newImages is empty, the backend should retain existing images (assuming your API handles this).


    try {
      await dispatch(
        updateProject({ id: project._id, updates: projectUpdateData })
      ).unwrap();
      toast.success("Project updated successfully!");
      onUpdateSuccess();
      // Clear previews and files on success
      newImagePreviews.forEach(url => URL.revokeObjectURL(url)); // Revoke URLs
      setNewImages([]);
      setNewImagePreviews([]);
    } catch (error) {
      toast.error(`Failed to update project: ${error.message || error}`);
    }
  };

  const handleRemoveNewImage = (indexToRemove) => {
    // Revoke the specific object URL to free up memory
    URL.revokeObjectURL(newImagePreviews[indexToRemove]);

    setNewImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setNewImages(prev => prev.filter((_, index) => index !== indexToRemove)); // Crucial: remove from files to be uploaded
  };

  const handleClose = () => {
    // Revoke all current new image object URLs before clearing
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setFormData(initialFormData);
    setNewImages([]);
    setExistingImages([]);
    setNewImagePreviews([]); // Clear previews
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="updateProjectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="updateProjectDescription">
            <Form.Label>Project Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter Project Description"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="updateProjectGitHubLink">
            <Form.Label>Project GitHub Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://github.com/username/repo"
              name="projectGitHubLink"
              value={formData.projectGitHubLink}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="updateProjectLiveLink">
            <Form.Label>Project Live Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://yourproject.com"
              name="projectLiveLink"
              value={formData.projectLiveLink}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="updateProjectTechStack">
            <Form.Label>Project Tech Stack</Form.Label>
            <Form.Control
              type="text"
              placeholder="React, Node.js, MongoDB"
              name="projectTechStack"
              value={formData.projectTechStack}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="updateProjectFeatures">
            <Form.Label>Project Features</Form.Label>
            <Form.Control
              type="text"
              placeholder="Feature 1, Feature 2"
              name="projectFeatures"
              value={formData.projectFeatures}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Images</Form.Label>
            {existingImages.length > 0 ? (
              <Row>
                {existingImages.map((img, index) => (
                  <Col xs={4} md={3} key={img.public_id || index} className="mb-2">
                    <Image
                      src={typeof img === 'string' ? img : img.url}
                      alt={`Existing image ${index + 1}`}
                      thumbnail
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No current images.</p>
            )}
          </Form.Group>

          <Form.Group controlId="updateProjectImages" className="mb-3">
            <Form.Label>Upload New Images</Form.Label>
            <Form.Control
              type="file"
              name="projectMultiImages"
              multiple
              onChange={handleImageChange}
            />
            <Form.Text className="text-muted">
              Uploading new images will replace the existing ones.
            </Form.Text>
            {newImagePreviews.length > 0 && (
              <div className="mt-3">
                <Form.Label>New Images to Upload:</Form.Label>
                <Row>
                  {newImagePreviews.map((previewUrl, index) => (
                    <Col xs={4} md={3} key={index} className="mb-2 position-relative">
                      <Image src={previewUrl} alt={`New Preview ${index + 1}`} thumbnail fluid />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1"
                        onClick={() => handleRemoveNewImage(index)}>X</Button>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update Project
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateProject;
