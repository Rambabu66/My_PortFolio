// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\viewPages\Home\Home.js
import React, {  useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Image, Row, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../../features/products/projectSlice';
import TextTruncate from 'react-text-truncate';
import myphotos from "../../Images/myphotos.jpeg"
import Typed from 'typed.js'

const Home = () => {
  const el=useRef(null)
const typed =useRef(null)

  const dispatch = useDispatch()
  const { projects = [],role } = useSelector(state => state.projects)

  // Filter projects to only include those with images.
  const projectsWithImages = projects.filter(p => p.projectMultiImages && p.projectMultiImages.length > 0);

  // Display only the first 3 of those projects on the home page.
  const displayedProjects = projectsWithImages.slice(0, 3);
  useEffect(() => {
    // Fetch projects only if they haven't been fetched yet or need refresh
    // You might want to add status checks here like in Projects.js
    dispatch(getProjects())
  }, [dispatch])

  useEffect(()=>{
    const options={
      strings:role,
      typeSpeed:100,
      backSpeed:100,
      loop:true
    }
    typed.current=new Typed(el.current,options)
    return()=>{
      typed.current.destroy()
    }
  },[role])


  return (
    <>
      {/* --- Hero Section --- */}
      <section className="home-hero  py-5 mt-5">
        <Container>
          <Row className='align-items-center gy-4'>
            <Col xs={12} md={6} lg={6} className='text-center order-md-1'>
              <Image
                src={myphotos} // Placeholder - Replace with your actual photo URL
                alt='Your Name or Profile Picture'
                roundedCircle
                fluid
                style={{ maxWidth: '300px', height: 'auto' }}
                className="profile-image shadow-sm"
              />
            </Col>
            <Col xs={12} md={6} lg={6} className='text-center text-md-start order-md-0'>
              <h1 className="display-4 fw-bold mb-3">Welcome to My Portfolio</h1>
              <p className="lead mb-4">
                Hi, I'm Rambabu, a passionate 
                I'm a <span ref={el} className="text-primary fs-3 fw-bold bg-light p-2 rounded-5 h-5"></span>
                with a specializing in building modern and responsive web applications. Explore my projects to see my skills in action.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                {/* Link to projects page is now below the project previews */}
                <Link to="/contacts">
                  <Button variant="outline-dark " className='text-primary fs-3 fw-bold  p-2 rounded-5 h-5' size="lg">Get In Touch</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- About Summary Section --- */}
      <section className="about-summary py-5">
        <Container>
          <Row>
            <Col className='text-center'>
              <h2>About Me</h2>
              <p>Brief introduction about your skills and experience...</p>
              {/* Make sure the /about route exists */}
              <Link to="/about">
                <Button variant="link">Read More</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- Recent Projects Section --- */}
      <section className="recent-projects py-5 "> {/* Added bg-light for contrast */}
        <Container>
          <h2 className='text-center mb-5'>Recent Projects</h2> {/* Changed h1 to h2 for better hierarchy */}
          <Row xs={1} md={2} lg={3} className="g-4 justify-content-center"> {/* Removed mt-3, added mb-5 to title */}
            {displayedProjects.length === 0 ? (
              <Col xs={12}> {/* Ensure this takes full width */}
                <div className='text-center mt-5 text-muted'> {/* Changed text color */}
                  <p className='fs-4 mb-3'>No projects found at the moment.</p>
                  {/* Optional: Link to contact or admin */}
                  {/* <p>Please contact the administrator if you believe this is an error.</p> */}
                  <Link to="/projects">
                    <Button variant="outline-primary">Go to All Projects</Button>
                  </Link>
                </div>
              </Col>
            ) : (
              displayedProjects.map((project) => (
                // Removed the unnecessary Fragment <> </>
                <Col className="d-flex" key={project._id}>
                  {/* Using Card component consistently */}
                  <Card className='w-100 shadow-sm project-card h-100'> {/* Added shadow, h-100 for equal height */}
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

          {/* --- Centered "View All Projects" Button --- */}
          {/* Only show this button if there are projects to show */}
          {projectsWithImages.length > 3 && (
            <Row className="mt-5"> {/* Add margin top */}
              <Col className="text-center"> {/* Center the content of this column */}
                <Link to="/projects">
                  <Button variant="primary" size="lg">View All Projects</Button>
                </Link>
              </Col>
            </Row>
          )}

        </Container>
      </section>

      {/* --- Contact Section --- */}
      <section className="contact-section py-5">
        <Container>
          <Row>
            <Col md={8} lg={6} className="mx-auto text-center"> {/* Center column content */}
              <h2>Get in Touch</h2>
              <p className="lead mt-3">
                Whether you want to discuss a potential project, ask a question, or just say hi, feel free to reach out!
              </p>
              <Button
                as={Link}
                to="/contacts" // Ensure this route exists
                variant="primary" // Make it stand out
                size="lg" // Larger button
                className="mt-4"
              >
                Contact Me
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
