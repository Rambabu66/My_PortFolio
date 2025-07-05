import { useState } from "react";
import { Button, Form, Modal, Image, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../../../features/products/projectSlice";
import { toast } from "react-toastify";

const AddProject = ({ show, onHide, onSaveSuccess }) => {
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
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // New state for image previews

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Generate image previews
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(newImagePreviews);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Manual validation with toasts
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

    const projectData = new FormData();

    Object.keys(formData).forEach((key) => {
      projectData.append(key, formData[key]);
    });

    for (let i = 0; i < images.length; i++) {
      projectData.append("projectMultiImages", images[i]);
    }

    try {
      await dispatch(createProject(projectData)).unwrap();
      toast.success("Project added successfully!");
      setFormData(initialFormData);
      setImages([]);
      setImagePreviews([]); // Clear previews on success
      onSaveSuccess();
    } catch (error) {
      toast.error(`Failed to add project: ${error.message || error}`);
    }
  };

  return (
    <Modal
      show={show} onHide={onHide} centered >
      <Modal.Header closeButton>
        <Modal.Title>New Project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicProjectname">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicProjectdescription">
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
          <Form.Group className="mb-3" controlId="formProjectGitHubLink">
            <Form.Label>Project GitHub Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://github.com/username/repo"
              name="projectGitHubLink"
              value={formData.projectGitHubLink}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProjectLiveLink">
            <Form.Label>Project Live Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://yourproject.com"
              name="projectLiveLink"
              value={formData.projectLiveLink}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProjectTechStack">
            <Form.Label>Project Tech Stack</Form.Label>
            <Form.Control
              type="text"
              placeholder="React, Node.js, MongoDB"
              name="projectTechStack"
              value={formData.projectTechStack}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProjectFeatures">
            <Form.Label>Project Features</Form.Label>
            <Form.Control
              type="text"
              placeholder="Feature 1, Feature 2"
              name="projectFeatures"
              value={formData.projectFeatures}
              onChange={handleInputChange}
            />
          </Form.Group>
          {/* upload Images */}
          <Form.Group controlId="formProjectImage" className="mb-3">
            <Form.Label>Project Images</Form.Label>
            <Form.Control
              type="file"
              name="projectMultiImages"
              multiple
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-3">
                <Form.Label>Selected Images:</Form.Label>
                <Row>
                  {imagePreviews.map((previewUrl, index) => (
                    <Col xs={4} md={3} key={index} className="mb-2 position-relative">
                      <Image src={previewUrl} alt={`Preview ${index + 1}`} thumbnail fluid />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1"
                        onClick={() => handleRemoveImage(index)}>X</Button>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="m-3" variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Project
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddProject;
