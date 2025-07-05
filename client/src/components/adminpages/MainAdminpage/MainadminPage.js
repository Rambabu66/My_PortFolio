import React, { useState } from 'react';
import { Button, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from '../AdminHomePage/HomePage';
import ProjectPage from '../ProjectPage/ProjectPage';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import Educationmainpage from '../AboutPage/Education/Educationmainpage';
import ExperinceMainpage from '../AboutPage/Experince/ExperinceMainpage';
import SkillsMainpage from '../AboutPage/SkillsLists/SkillsMainpage';
import ProjectsMainpage from '../ProjectsPages/ProjectsMainpage';
import { toast } from 'react-toastify';

const MainadminPage = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate =useNavigate()
      const [show, setShow] = useState(false);
      const handleShow = () => setShow(true);


    const handleLogout =()=>{
      toast.success('Logout Successfully,And Back to View Page')
      dispatch(logout())
      navigate('/')
    }
  return (
    <>
      <Row>
        <Col>
          <Navbar bg="dark" variant="dark" >
            <Container>
               {/* Toggle button for mobile screens */}
                    <Col md={3} className="d-lg-none" >
                      <Button variant="primary" onClick={handleShow} >
                        Toggle Sidebar
                      </Button>
                    </Col>
              <Navbar.Brand as={Link} to="/admin/homepage"   className={`handlelink ${location.pathname === '/admin/homepage' ? 'active' : ''}`}>Admin Page</Navbar.Brand>
              <Nav>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                
              </Nav>
            </Container>
          </Navbar>
        </Col>
      </Row>
      <Row>
        <Sidebar show={show} setShow={setShow} />
        <Col md={10} >
          <Routes>
            <Route path="/homepage" element={<HomePage />} />
            {/* <Route path="/aboutpage" element={<AboutPage />} /> */}
            <Route path='/skillspage' element={<SkillsMainpage />} />
            <Route path="/educationpage" element={<Educationmainpage />} />
            <Route path ="/experincepage" element={<ExperinceMainpage />} />
            <Route path="/projectspage" element={<ProjectsMainpage />} />
            {/* <Route path="/projectspage" element={<ProjectPage />} /> */}
          </Routes>
        </Col>
      </Row>
    </>
  );
};

export default MainadminPage;
