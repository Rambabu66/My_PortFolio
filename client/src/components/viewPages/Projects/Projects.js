// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\viewPages\Projects\Projects.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from '../../../features/products/projectSlice';
import { Alert, Button, Card, Col, Container, Image, Row, Spinner } from 'react-bootstrap'; // Correct import if using react-bootstrap
import TextTruncate from 'react-text-truncate';
import { Link } from "react-router-dom"
// Base URL might not be needed here if full URLs are stored
// const API_BASE_URL = "http://localhost:5004";

const Projects = () => {
  const dispatch = useDispatch();
  const { projects = [], status, error } = useSelector(state => state.projects);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getProjects());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Container className='py-5 text-center'><Spinner animation="border" /> Loading Projects...</Container>;
  }

  if (status === 'failed') {
    return <Container className='py-5'>
        <Alert variant="danger">Error loading projects: {error || 'Unknown error'}</Alert>
     </Container>;
  }

  const projectsWithImages = projects.filter(p => p.projectMultiImages && p.projectMultiImages.length > 0);

  return (
    <>
      <Container >
        <h1 className='text-center py-5 mt-5'>Projects</h1>
        <Row xs={1} md={2} lg={3} className="g-4 justify-content-center mb-3">
          {projectsWithImages.length === 0 ? (
            <Col>
              <div className='text-center mt-4 text-danger fs-1'>No projects found. Plz contact admin.</div>
            </Col>
          ) : (
            projectsWithImages.map((project) => (
              <Col className="d-flex" key={project._id}>
                <Card className='w-100'>
                  <div className='image-container'>
                    <Image
                      src={project.projectMultiImages[0]}
                      alt={project.projectName || 'Project image'}
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      rounded
                      fluid
                    />

                    <div className='overlay'>
                      <Card.Body>
                        <div className='d-flex justify-content-between'>
                          <div style={{ margin: "20px" }}>
                            <Card.Title>{project.projectName}</Card.Title>
                            <Card.Text className="text-justify">
                              <TextTruncate
                                line={2}
                                element="span"
                                truncateText="..."
                                text={project.projectDescription}
                              />
                            </Card.Text>
                          </div>
                          <Link to={`/projects/${project._id}`}> <Button >Details</Button></Link>
                        </div>
                        <div className="d-flex justify-content-around">
                          <Button variant="primary" href={project.projectGitHubLink} target="_blank">
                            GitHub
                          </Button>
                          <Button variant="success" href={project.projectLiveLink} target="_blank">
                            Live
                          </Button>
                          {/* <Button variant="danger" onClick={() => handleDeleteClick(item.id)}>
                            Delete
                          </Button> */}
                        </div>

                      </Card.Body>
                    </div>
                  </div>
                </Card>
              </Col>

            ))
          )}
        </Row>
      </Container>
    </>
  );
}

export default Projects;
