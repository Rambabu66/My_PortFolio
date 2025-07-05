// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\viewPages\Projects\ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Image, Row, Spinner, Alert } from 'react-bootstrap'; // Added Spinner, Alert
import { useDispatch, useSelector } from 'react-redux';
import { Link,  useParams } from 'react-router-dom';
// import ProjectUpdateForm from './ProjectUpdateForm'; // Assuming this component is adapted for FormData and correct field names
// Import actions from the correct slice
import { getProjectById,} from '../../../features/products/projectSlice';
// import { showErrorToast, showSuccessToast } from '../../../utils/ToastUtils'; // Assuming this path is correct

const ProjectDetails = () => {
    const { id } = useParams(); // Get the project ID from the URL
    const dispatch = useDispatch();

    // Select data from the 'projects' slice
    const {
        project: projectDetails, // The single project fetched by ID
        status,
        error
    } = useSelector((state) => state.projects);
    console.log("Fetched Project Details:", projectDetails); // <-- ADD THIS LINE


    const [mainImage, setMainImage] = useState(null);

    // Fetch project details when component mounts or ID changes
    useEffect(() => {
        if (id) {
            dispatch(getProjectById(id));
        }
        
    }, [dispatch, id]);

    // Update main image when projectDetails load or change
    useEffect(() => {
        // Use the first image from projectMultiImages as the default main image
        if (projectDetails?.projectMultiImages && projectDetails.projectMultiImages.length > 0) {
            setMainImage(projectDetails.projectMultiImages[0]);
        } else {
            setMainImage(null); // Handle case with no images
        }
    }, [projectDetails]);

    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    // Combine all available images (assuming projectMultiImages holds all)
    // Ensure projectDetails and projectMultiImages exist before mapping
    const allImages = projectDetails?.projectMultiImages?.filter(Boolean) || [];

  


    // --- Render Logic ---

    if (status === 'loading') {
        return <Container className='py-5 text-center'><Spinner animation="border" /> Loading Project...</Container>;
    }

    if (status === 'failed') {
        return <Container className='py-5'>
            <Alert variant="danger">Error loading project: {error || 'Unknown error'}</Alert>
            <Link to="/projects">
                <Button variant="secondary">Back to Projects</Button>
            </Link>
        </Container>;
    }

    if (!projectDetails) {
        // This might happen briefly after loading or if fetch succeeded but returned null/undefined
        return <Container className='py-5'>
            <p>Project not found or still loading.</p>
            <Link to="/projects">
                <Button variant="secondary">Back to Projects</Button>
            </Link>
        </Container>;
    }

    // --- Main Component Render ---
    return (
        <>
            <Container className='py-5 mt-5'>
                <Row className="mb-3">
                    <Col className='d-flex justify-content-between align-items-center'>
                    <h2>Project Details</h2>
                        <Link to="/projects">
                            <Button variant="secondary">Back to Projects</Button>
                        </Link>
                        
                    </Col>
                </Row>
                <Row>
                    {/* Image Gallery Column */}
                    <Col md={6}>
                    
                        {mainImage ? (
                            <Image
                                src={mainImage}
                                alt={projectDetails.projectName} // Use correct field name
                                style={{ width: '100%', height: '400px', objectFit: 'cover', cursor: 'pointer' }} // Added objectFit and cursor
                                className='rounded w-100 mb-3'
                                onClick={() => { // Cycle through images on click
                                    const currentIndex = allImages.indexOf(mainImage);
                                    const nextIndex = (currentIndex + 1) % allImages.length;
                                    setMainImage(allImages[nextIndex]);
                                }}
                                fluid // Use fluid instead of fixed width/height style for responsiveness
                            />
                        ) : (
                            <div style={{ width: '100%', height: '400px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='rounded mb-3'>
                                No image available
                            </div>
                        )}
                        {/* Thumbnails */}
                        <div className='d-flex gap-2 flex-wrap'>
                            {allImages.map((imageUrl, index) => (
                                <Image
                                    key={index}
                                    src={imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    style={{
                                        width: "80px",
                                        height: "60px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        border: mainImage === imageUrl ? '2px solid blue' : '2px solid transparent' // Highlight active thumbnail
                                    }}
                                    className='rounded'
                                    onClick={() => handleImageClick(imageUrl)}
                                />
                            ))}
                        </div>
                    </Col>

                    {/* Details Column */}
                    <Col md={6}>
                        {/* Use correct field names */}
                        <h2>{projectDetails.projectName}</h2>
                        <p>
                            <strong>Description:</strong> {projectDetails.projectDescription}
                        </p>
                        <p>
                        <strong>Technologies:</strong> {
                            // --- MODIFICATION START ---
                            // Check if projectTechStack exists AND is an array before joining
                            projectDetails.projectTechStack && Array.isArray(projectDetails.projectTechStack)
                                ? projectDetails.projectTechStack.join(', ')
                                : // Optional: Handle if it's a string already (display as is)
                                  typeof projectDetails.projectTechStack === 'string'
                                  ? projectDetails.projectTechStack
                                  : 'N/A' // Fallback if it's not an array or string
                            // --- MODIFICATION END ---
                        }
                    </p>
                        <p>
                        <strong>Features:</strong> {
                            // --- MODIFICATION START ---
                            // Check if projectTechStack exists AND is an array before joining
                            projectDetails.projectFeatures && Array.isArray(projectDetails.projectFeatures)
                                ? projectDetails.projectTechStack.join(', ')
                                : // Optional: Handle if it's a string already (display as is)
                                  typeof projectDetails.projectFeatures === 'string'
                                  ? projectDetails.projectFeatures
                                  : 'N/A' // Fallback if it's not an array or string
                            // --- MODIFICATION END ---
                        }
                            {/* <strong>Features:</strong> {projectDetails.projectFeatures} */}
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            {projectDetails.projectGitHubLink && (
                                <Button variant="dark" href={projectDetails.projectGitHubLink} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-github me-2"></i> GitHub
                                </Button>
                            )}
                            {projectDetails.projectLiveLink && (
                                <Button variant="success" href={projectDetails.projectLiveLink} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-box-arrow-up-right me-2"></i> Live Demo
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

                
            </Container>
        </>
    );
}

export default ProjectDetails;
