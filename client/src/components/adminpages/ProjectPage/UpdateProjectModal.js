// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\adminpages\ProjectPage\UpdateProjectModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image, CloseButton } from 'react-bootstrap'; // Added Image, CloseButton
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProject } from '../../../features/products/projectSlice';

// Helper to convert array to comma-separated string for form fields
const arrayToCommaString = (arr) => (Array.isArray(arr) ? arr.join(', ') : arr || '');

const UpdateProjectModal = ({ show, handleClose, projectData }) => {
    const dispatch = useDispatch();
    const initialFormData = {
        projectName: '',
        projectDescription: '',
        projectGitHubLink: '',
        projectLiveLink: '',
        projectTechStack: '',
        projectFeatures: '',
    };
    const [updatedProjectData, setUpdatedProjectData] = useState(initialFormData);
    // State for new files to upload
    const [newProjectFiles, setNewProjectFiles] = useState([]);
    // State to track which existing images to delete
    const [imagesToDelete, setImagesToDelete] = useState([]);
    // State to display current images (filtered by imagesToDelete)
    const [currentImages, setCurrentImages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // --- Populate form when projectData changes (modal opens) ---
    useEffect(() => {
        if (projectData) {
            console.log("Project Data Received:", projectData); // Debug log
            setUpdatedProjectData({
                projectName: projectData.projectName || '',
                projectDescription: projectData.projectDescription || '',
                projectGitHubLink: projectData.projectGitHubLink || '',
                projectLiveLink: projectData.projectLiveLink || '',
                projectTechStack: arrayToCommaString(projectData.projectTechStack),
                projectFeatures: arrayToCommaString(projectData.projectFeatures),
            });
            // Initialize current images and reset deletions/new files
            setCurrentImages(projectData.projectMultiImages || []);
            setImagesToDelete([]);
            setNewProjectFiles([]);
            setIsSaving(false);
        } else {
            // Reset when projectData is null (e.g., modal closed improperly)
            setUpdatedProjectData(initialFormData);
            setCurrentImages([]);
            setImagesToDelete([]);
            setNewProjectFiles([]);
        }
    }, [projectData]); // Re-run effect when projectData prop changes
    // -----------------------------------------------------------

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProjectData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle new file input
    const handleFileChange = (e) => {
        setNewProjectFiles(Array.from(e.target.files)); // Store as an array
    };

    // Handle marking an existing image for deletion
    const handleMarkForDelete = (imageIdentifier) => {
        // Use the unique identifier (e.g., URL or public_id)
        console.log("Marking for delete:", imageIdentifier); // Debug log
        setImagesToDelete(prev => [...prev, imageIdentifier]);
        // Visually remove it from the displayed current images
        setCurrentImages(prev => prev.filter(img => (img.public_id || img.url) !== imageIdentifier));
    };

    const validateForm = () => {
        if (!updatedProjectData.projectName || !updatedProjectData.projectDescription) {
            toast.error('Project Name and Description are required.');
            return false;
        }
        if (!projectData?._id) {
            toast.error('Cannot update project without a valid ID.');
            return false;
        }
        return true;
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSaving(true);

        // --- Create Payload using FormData ---
        const formData = new FormData();

        // Append text fields
        Object.keys(updatedProjectData).forEach(key => {
            // Handle potential arrays from comma-separated strings if needed by backend
            if (key === 'projectTechStack' || key === 'projectFeatures') {
                // Example: Split string into an array before sending if backend expects array
                // const valueArray = updatedProjectData[key].split(',').map(item => item.trim()).filter(Boolean);
                // valueArray.forEach(item => formData.append(`${key}[]`, item));
                // Or append the string directly if backend handles splitting/parsing
                formData.append(key, updatedProjectData[key]);
            } else {
                formData.append(key, updatedProjectData[key]);
            }
        });

        // Append new files if any
        // 'newProjectMultiImages' should match the field name your backend expects for *new* uploads
        if (newProjectFiles.length > 0) {
            for (let i = 0; i < newProjectFiles.length; i++) {
                formData.append('newProjectMultiImages', newProjectFiles[i]);
            }
        }

        // Append IDs/URLs of images to delete (backend needs to parse this)
        // Sending as JSON string is common
        if (imagesToDelete.length > 0) {
            formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }
        // ----------------------

        // Log FormData contents (for debugging)
        console.log("Updating project with FormData:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        console.log("Project ID:", projectData._id);


        try {
            // Dispatch the updateProject action
            // The thunk needs to handle FormData and send the ID correctly (e.g., in URL)
            // In UpdateProjectModal.js
            await dispatch(updateProject({ id: projectData._id, updates: formData })).unwrap();
            toast.success("Project updated successfully!");
            handleModalClose(); // Close modal on success


        } catch (error) {
            console.error("Failed to update project:", error);
            // Attempt to get a more specific error message
            const errorMessage = error?.message || (typeof error === 'string' ? error : "Failed to update project. Check console.");
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Use a separate close handler for this modal
    const handleModalClose = () => {
        // Reset local state before calling parent handler
        setUpdatedProjectData(initialFormData);
        setNewProjectFiles([]);
        setImagesToDelete([]);
        setCurrentImages([]); // Clear displayed images
        setIsSaving(false);
        handleClose(); // Call parent close handler
    }

    return (
        <Modal show={show} onHide={handleModalClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!projectData ? (
                    <div className="text-center"><Spinner animation="border" /> Loading data...</div>
                ) : (
                    <>
                        {/* Ensure Form doesn't have encType, JS handles it */}
                        <Form onSubmit={handleSaveChanges}>
                            {/* Text Fields (Project Name, Description, Links, Tech, Features) */}
                            {/* Project Name */}
                            <Form.Group className="mb-3" controlId="updateFormProjectName">
                                <Form.Label>Project Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="projectName"
                                    value={updatedProjectData.projectName}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSaving}
                                />
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className="mb-3" controlId="updateFormProjectDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="projectDescription"
                                    value={updatedProjectData.projectDescription}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSaving}
                                />
                            </Form.Group>

                            {/* GitHub Link */}
                            <Form.Group className="mb-3" controlId="updateFormProjectGitHubLink">
                                <Form.Label>GitHub Link</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="https://github.com/..."
                                    name="projectGitHubLink"
                                    value={updatedProjectData.projectGitHubLink}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                />
                            </Form.Group>

                            {/* Live Link */}
                            <Form.Group className="mb-3" controlId="updateFormProjectLiveLink">
                                <Form.Label>Live Link</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="https://yourproject.com"
                                    name="projectLiveLink"
                                    value={updatedProjectData.projectLiveLink}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                />
                            </Form.Group>

                            {/* Tech Stack */}
                            <Form.Group className="mb-3" controlId="updateFormProjectTechStack">
                                <Form.Label>Tech Stack (comma-separated)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="React, Node.js, MongoDB"
                                    name="projectTechStack"
                                    value={updatedProjectData.projectTechStack}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                />
                            </Form.Group>

                            {/* Features */}
                            <Form.Group className="mb-3" controlId="updateFormProjectFeatures">
                                <Form.Label>Features (comma-separated)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Feature 1, Feature 2"
                                    name="projectFeatures"
                                    value={updatedProjectData.projectFeatures}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                />
                            </Form.Group>


                            {/* --- Image Handling --- */}
                            <Form.Group controlId="updateFormProjectImages" className="mb-3">
                                <Form.Label>Current Images</Form.Label>
                                <div className="d-flex flex-wrap align-items-start">
                                    {currentImages && currentImages.length > 0 ? (
                                        currentImages.map((img, index) => {
                                            // Determine the unique key/identifier for deletion
                                            const imageIdentifier = img.public_id || img.url || `img-${index}`; // Fallback key
                                            const imageUrl = img.url || img; // Handle if structure is just array of URLs

                                            // Ensure we have a valid URL before rendering
                                            if (!imageUrl) {
                                                console.warn("Skipping image render due to missing URL:", img);
                                                return null;
                                            }

                                            return (
                                                <div key={imageIdentifier} className="position-relative me-2 mb-2 border p-1">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`Current project image ${index + 1}`}
                                                        thumbnail
                                                        style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                                                    />
                                                    <CloseButton
                                                        className="position-absolute top-0 end-0 bg-danger bg-opacity-75 text-white rounded-circle p-1"
                                                        style={{ transform: 'translate(30%, -30%)', width: '1.2rem', height: '1.2rem', lineHeight: '0.5' }}
                                                        title="Mark for deletion"
                                                        onClick={() => handleMarkForDelete(imageIdentifier)}
                                                        disabled={isSaving}
                                                        aria-label="Mark image for deletion"
                                                    />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p><small>No current images.</small></p>
                                    )}
                                </div>

                                <Form.Label className="mt-3">Add New Images</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple
                                    disabled={isSaving}
                                    // Add accept attribute for better UX
                                    accept="image/png, image/jpeg, image/gif, image/webp"
                                />
                                {newProjectFiles.length > 0 && (
                                    <Form.Text className="text-muted">
                                        {newProjectFiles.length} new file(s) selected. Previous images marked for deletion will be removed upon saving.
                                    </Form.Text>
                                )}
                            </Form.Group>
                            {/* ------------------------------------- */}


                            <div className="d-flex justify-content-end mt-4">
                                <Button variant="secondary" onClick={handleModalClose} className="me-2" disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" disabled={isSaving}>
                                    {isSaving ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...</> : 'Save Changes'}
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default UpdateProjectModal;
