// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\adminpages\ProjectPage\ProjectPage.js
import React, { useEffect, useState } from 'react';
import { Button, Container, Image, Table, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// Ensure updateProject is imported if you ever need to dispatch it directly from here (though not needed for the modal flow)
import { deleteProject, getProjects } from '../../../features/products/projectSlice';
import AddProjectModal from './AddProjectModal';
import UpdateProjectModal from './UpdateProjectModal';
import CustomPagination from '../../common/CustomPagination';
import { toast } from 'react-toastify';

const ProjectPage = () => {
    const dispatch = useDispatch();
    // This selector correctly subscribes to the projects state in Redux
    const { projects = [], status, error } = useSelector(state => state.projects);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [projectToUpdate, setProjectToUpdate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5)
    const indexofFirstPage = currentPage * itemsPerPage;
    const indexOfLastPage = indexofFirstPage - itemsPerPage
    const currentItems= projects.slice(indexOfLastPage, indexofFirstPage)
    const totalPages = Math.ceil(projects.length / itemsPerPage)

    const handleChangePages = (pageNumber) => {
        setCurrentPage(pageNumber)
        }
    

    useEffect(() => {
        // Fetch initial data if needed
        if (status === 'idle') {
            dispatch(getProjects());
        }
        // No need to refetch on 'succeeded' here,
        // the updateProject.fulfilled reducer handles the state update directly.
    }, [status, dispatch]);

    const handleUpdate = (project) => {
        console.log(`Preparing to update project:`, project); // Good for debugging
        setProjectToUpdate(project);
        setShowUpdateModal(true);
    };

    const handleDelete = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            dispatch(deleteProject(projectId))
                .unwrap()
                .then(() => {
                    toast.success("Project deleted successfully!");
                    if (currentItems.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                })
                .catch((err) => {
                    const errorMessage = err?.message || "Failed to delete project.";
                    toast.error(errorMessage);
                });
        }
    };

    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setProjectToUpdate(null);
    };

    // Helper function to render content based on status
    const renderContent = () => {
        // Loading state for initial load
        if (status === 'loading' && projects.length === 0) {
            return (
                <div className="text-center mt-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }

        // Error state for initial load
        if (status === 'failed' && projects.length === 0 && error) {
             return <Alert variant="danger" className="mt-3">Error loading projects: {error} <Button onClick={handleShowAddModal} className='ms-5'>Add New Project</Button></Alert>;
        }

        // No projects found state
        if (status !== 'loading' && projects.length === 0) {
            return (
                <div className='text-center mt-3'>
                    <h4>No Projects Found</h4>
                    <p>Click the "Add New Project" button to get started.</p>
                </div>
            );
        }

        // Success State (Table or No Projects Message)
        return (
            <>
                 {/* Optional: Show a spinner during updates/deletes if desired */}
                 {status === 'loading' && projects.length > 0 && (
                     <div className="text-center my-2">
                         <Spinner animation="border" size="sm" /> Processing...
                     </div>
                 )}

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>GitHub</th>
                            <th>Live Link</th>
                            <th>Tech Stack</th>
                            <th>Features</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* The component will re-render with updated 'projects' here */}
                        {currentItems.map((project, i) => (
                                <tr key={project?._id || i}> {/* Using _id is important */}
                                    <td>{indexOfLastPage + i + 1}</td>
                                    <td>
                                         {project?.projectMultiImages && project.projectMultiImages.length > 0 ? (
                                            <Image
                                                // Ensure the URL is correct based on your backend/Cloudinary setup
                                                src={project.projectMultiImages[0]?.url || project.projectMultiImages[0] || '/path/to/default-image.png'}
                                                alt={project.projectName || 'Project image'}
                                                style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                                                rounded
                                                fluid
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td>{project?.projectName ?? 'N/A'}</td>
                                    {/* Use optional chaining and nullish coalescing for safety */}
                                    <td>{project?.projectDescription?.substring(0, 50)}{project?.projectDescription?.length > 50 ? '...' : ''}</td>
                                    <td>
                                         {project?.projectGitHubLink ? (
                                            <a href={project.projectGitHubLink} target="_blank" rel="noopener noreferrer">Link</a>
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </td>
                                    <td>
                                         {project?.projectLiveLink ? (
                                            <a href={project.projectLiveLink} target="_blank" rel="noopener noreferrer">Link</a>
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </td>
                                    {/* Display arrays correctly */}
                                    <td>{Array.isArray(project?.projectTechStack) ? project.projectTechStack.join(', ') : project?.projectTechStack || 'N/A'}</td>
                                    <td>{Array.isArray(project?.projectFeatures) ? project.projectFeatures.join(', ') : project?.projectFeatures || 'N/A'}</td>
                                    <td>
                                        {/* Ensure project._id exists before rendering buttons */}
                                        {project?._id && (
                                            <>
                                                {/* Pass the whole project object */}
                                                <Button className='me-2' variant='warning' size='sm' onClick={() => handleUpdate(project)}>Update</Button>
                                                <Button variant='danger' size='sm' onClick={() => handleDelete(project._id)}>Delete</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </>
        );
    };

    return (
        <Container>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Projects</h1>
                {/* Show Add button unless initial load is happening or failed */}
                {status !== 'loading' && !(status === 'failed' && projects.length === 0) && (
                     <Button onClick={handleShowAddModal}>Add New Project</Button>
                )}
            </div>

            {/* This function renders the table using the latest 'projects' from Redux */}
            {renderContent()}

            {/* Add Project Modal */}
            {totalPages > 1 && (
                <CustomPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handleChangePages}
                />
            )}
            <AddProjectModal
                show={showAddModal}
                handleClose={handleCloseAddModal}
            />

            {/* Update Project Modal - Render only when projectToUpdate is set */}
            {projectToUpdate && (
                <UpdateProjectModal
                    show={showUpdateModal}
                    handleClose={handleCloseUpdateModal}
                    projectData={projectToUpdate} // Pass the specific project data
                />
            )}
        </Container>
    );
};

export default ProjectPage;
