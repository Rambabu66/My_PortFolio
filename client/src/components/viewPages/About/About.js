// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\viewPages\About\About.js
import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Container, Image, Row, ListGroup, Alert, Spinner } from 'react-bootstrap';
import myphotos from '../../Images/myphoto.jpeg'
import Typed from 'typed.js';
import { useSelector } from 'react-redux';
// import { getAllSkillsAPI } from '../../../features/skills/skillsSlice'; // Corrected path
import EducationDetails from './EducationDetails';
import ExperinceDetails from './ExperinceDetails';
import SkillsDetails from './SkillsDetails';







const About = () => {
  const el = useRef(null)
  const typed = useRef(null)
  const {role} = useSelector((state) => state.projects)

  
  useEffect(()=>{
    const options={
      strings:role,
      typeSpeed:100,
      backSpeed:60,
      loop:true

    }
    typed.current=new Typed(el.current,options)
    return()=>{
      typed.current.destroy()
    }

  },[role])


  return (
    <>
      {/* --- Introduction Section --- */}
      <section className='about-intro py-5 mt-5 '>
        <Container>
          <h1 className='text-center mb-5'>About Me</h1>
          <Row className='align-items-center gy-4'>
            <Col xs={12} md={6}  className='text-center order-md-0'>
              <Image
                src={myphotos} // Placeholder
                alt='Rambabu - Profile Picture'
                roundedCircle
                fluid
                style={{ maxWidth: '350px', height: 'auto', border: '5px solid white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              />
            </Col>
            <Col xs={12} md={6} className='text-center text-md-start order-md-1'>
              <div>
                <h2 className="fw-bold">Hi, I'm Rambabu</h2>
                <p className="lead mt-3">
                  I'm a passionate and dedicated <span ref={el} className="text-text fs-3 fw-bold  h-5"></span> with a strong foundation in building modern, responsive, and user-friendly web applications.
                </p>
                <p>
                  My journey into web development started with [mention your origin story briefly, e.g., a fascination for how websites worked]. Since then, I've honed my skills in both front-end and back-end technologies, always eager to learn and adapt to the ever-evolving tech landscape.
                </p>
                <p>
                  I thrive on solving complex problems and enjoy collaborating with teams to bring innovative ideas to life. My goal is to create applications that are not only functional but also provide a seamless and enjoyable experience for the end-user.
                </p>
                {/* Optional: Add a link to your resume or LinkedIn */}
                {/* <Button variant="outline-primary" href="/path/to/your/resume.pdf" target="_blank" className="me-2">View Resume</Button> */}
                {/* <Button variant="outline-info" href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn Profile</Button> */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- Skills Section --- */}
     
      <SkillsDetails />

      {/* --- Experience & Education Section --- */}
      <section className='experience-education-section py-5 '>
        <Container>
          {/* Kept the line here as it wasn't requested to be removed */}
         
          <Row className="g-5">

            {/* Experience Column */}
            <Col md={6}>
             <ExperinceDetails />
            </Col>

            {/* Education Column */}
            <Col md={6}>
            <EducationDetails />
              
            </Col>

          </Row>
        </Container>
      </section>
    </>
  );
}

export default About;
