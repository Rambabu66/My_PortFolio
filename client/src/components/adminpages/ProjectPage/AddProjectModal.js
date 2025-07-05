// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\adminpages\ProjectPage\AddProjectModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap'; // Removed Alert
import { useDispatch } from 'react-redux';
import { createProject } from '../../../features/products/projectSlice';
import { toast } from 'react-toastify';

const AddProjectModal = ({ show, handleClose }) => {
    const dispatch = useDispatch();
    const initialFormData = {
        projectName: '',
        projectDescription: '',
        projectGitHubLink: '',
        projectLiveLink: '',
        projectTechStack: '',
        projectFeatures: '',
    };
    const [newProjectData, setNewProjectData] = useState(initialFormData);
    // State specifically for files
    const [projectFiles, setProjectFiles] = useState([]);
    // Add state for loading/error specific to the modal
    const [isSaving, setIsSaving] = useState(false); // Removed saveError state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProjectData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Helper function for validation and toast display
    const validateForm = () => {
        const missingFields = [];
        if (!newProjectData.projectName) {
            missingFields.push('Project Name');
        }
        if (!newProjectData.projectDescription) {
            missingFields.push('Description');
        }

        if (missingFields.length > 0) {
            let message = '';
            if (missingFields.length === 1) {
                message = `${missingFields[0]} is required.`;
            } else {
                message = `${missingFields.join(' and ')} are required.`;
            }
            toast.error(message);
            return false;
        }
        return true;
    };

    // Handle file input
    const handleFileChange = (e) => {
        // Store the FileList object
        setProjectFiles(e.target.files);
    };

    const handleSaveNewProject = async (e) => {
        e.preventDefault();
        if (!validateForm()) { // Use the new validation function
            return;
        }

        setIsSaving(true);

        // --- Create FormData ---
        const formData = new FormData();

        // Append text fields
        Object.keys(newProjectData).forEach(key => {
            // Handle potential arrays from comma-separated strings if needed by backend
            if (key === 'projectTechStack' || key === 'projectFeatures') {
                 // Example: Split string into an array before sending if backend expects array
                 const valueArray = newProjectData[key].split(',').map(item => item.trim()).filter(Boolean);
                 // Append each item if backend expects multiple entries for the same key
                 // valueArray.forEach(item => formData.append(`${key}[]`, item));
                 // Or append the string directly if backend handles splitting
                 formData.append(key, newProjectData[key]);
            } else {
                formData.append(key, newProjectData[key]);
            }
        });

        // Append files
        // 'projectMultiImages' should match the field name your backend expects (e.g., using multer)
        if (projectFiles.length > 0) {
            for (let i = 0; i < projectFiles.length; i++) {
                formData.append('projectMultiImages', projectFiles[i]);
            }
        } else {
             // Explicitly send an empty array or handle as needed by backend if no files
             // formData.append('projectMultiImages', []); // Might not work as expected with FormData
             // Often, you just don't append the field if there are no files.
             // Check your backend requirements.
        }
        // ----------------------

        console.log("Saving project with FormData..."); // Log before dispatch

        try {
            // Dispatch the createProject action with the FormData
            await dispatch(createProject(formData)).unwrap(); // Use .unwrap() to handle rejections
            toast.success("Project added successfully!");
            handleModalClose(); // Close only on success

        } catch (error) {
            console.error("Failed to save project:", error);
            // Extract meaningful error message from Redux Toolkit's error object if possible
            const errorMessage = error?.message || error?.error || "Failed to save project. Check console and network logs.";
            toast.error(errorMessage); // Display error using toast
        } finally {
            setIsSaving(false);
        }
    };

    const handleModalClose = () => {
        setNewProjectData(initialFormData); // Reset form fields
        setProjectFiles([]); // Reset files
        setIsSaving(false); // Reset saving state
        handleClose(); // Call parent close handler
    }

    return (
        <Modal show={show} onHide={handleModalClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body> {/* Removed Alert component */}
                {/* Make sure the Form tag does NOT have encType if using FormData via JS */}
                <Form onSubmit={handleSaveNewProject}>
                    {/* ... (Form.Group for projectName) ... */}
                     <Form.Group className="mb-3" controlId="formProjectName">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter project name"
                            name="projectName"
                            value={newProjectData.projectName}
                            onChange={handleInputChange}
                            disabled={isSaving}
                            required // Added required attribute
                        />
                    </Form.Group>

                    {/* ... (Form.Group for projectDescription) ... */}
                     <Form.Group className="mb-3" controlId="formProjectDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Project description"
                            name="projectDescription"
                            value={newProjectData.projectDescription}
                            onChange={handleInputChange}
                            disabled={isSaving}
                            required // Added required attribute
                        />
                    </Form.Group>

                    {/* ... (Form.Group for projectGitHubLink) ... */}
                     <Form.Group className="mb-3" controlId="formProjectGitHubLink">
                        <Form.Label>GitHub Link</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="https://github.com/..."
                            name="projectGitHubLink"
                            value={newProjectData.projectGitHubLink}
                            onChange={handleInputChange}
                            disabled={isSaving}
                        />
                    </Form.Group>

                    {/* ... (Form.Group for projectLiveLink) ... */}
                     <Form.Group className="mb-3" controlId="formProjectLiveLink">
                        <Form.Label>Live Link</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="https://yourproject.com"
                            name="projectLiveLink"
                            value={newProjectData.projectLiveLink}
                            onChange={handleInputChange}
                            disabled={isSaving}
                        />
                    </Form.Group>

                    {/* ... (Form.Group for projectTechStack) ... */}
                     <Form.Group className="mb-3" controlId="formProjectTechStack">
                        <Form.Label>Tech Stack (comma-separated)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="React, Node.js, MongoDB"
                            name="projectTechStack"
                            value={newProjectData.projectTechStack}
                            onChange={handleInputChange}
                            disabled={isSaving}
                        />
                    </Form.Group>

                    {/* ... (Form.Group for projectFeatures) ... */}
                     <Form.Group className="mb-3" controlId="formProjectFeatures">
                        <Form.Label>Features (comma-separated)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Feature 1, Feature 2"
                            name="projectFeatures"
                            value={newProjectData.projectFeatures}
                            onChange={handleInputChange}
                            disabled={isSaving}
                        />
                    </Form.Group>

                    {/* --- Updated File Input --- */}
                    <Form.Group controlId="formProjectImage" className="mb-3">
                        <Form.Label>Project Images</Form.Label>
                        <Form.Control
                            type="file"
                            name="projectMultiImages" // Name attribute might not be strictly needed here
                            onChange={handleFileChange}
                            multiple
                            disabled={isSaving}
                            accept="image/png, image/jpeg, image/gif, image/webp" // Added accept attribute
                        />
                        {projectFiles.length > 0 && (
                            <Form.Text className="text-muted">
                                {projectFiles.length} file(s) selected.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleModalClose} className="me-2" disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSaving}>
                            {isSaving ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...</> : 'Save Project'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProjectModal;
