// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\viewPages\Header\Header.js
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from 'react-router-dom';
// import './Header.css'; // No need to import if only using utility classes

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(prevIsScrolled => prevIsScrolled !== scrolled ? scrolled : prevIsScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeNavbar = () => setExpanded(false);
  const toggleNavbar = () => setExpanded(prevExpanded => !prevExpanded);

  const navbarBg = isScrolled ? 'dark' : 'transparent';
  const navbarVariant = 'dark'; // This already helps with text color on dark backgrounds

  // --- MODIFIED: Add Bootstrap font-size class ---
  const getBrandClasses = () => {
    const classes = ['fs-4', 'text-white']; // Example: Use fs-4 for the brand and ensure it's white
    if (isScrolled) classes.push('handlelink'); // 'handlelink' might need to be defined in CSS if it's custom
    if (location.pathname === '/') classes.push('active');
    return classes.join(' ');
  };

  // --- MODIFIED: Add Bootstrap font-size and text-white class ---
  const getNavLinkClass = (path) => {
    const classes = ['fs-5', 'text-white']; // Example: Use fs-5 for nav links and set text to white
    if (location.pathname === path) classes.push('active'); // 'active' class might also control color
    return classes.join(' ');
  };

  return (
    <Navbar
      expanded={expanded}
      onToggle={toggleNavbar}
      expand="md"
      bg={navbarBg}
      variant={navbarVariant}
      fixed="top"
      className={isScrolled ? 'navbar-scrolled' : ''}
    >
      <Container>
        {/* --- MODIFIED: Use the function for className --- */}
        <Navbar.Brand as={Link} to="../" onClick={closeNavbar} className={getBrandClasses()}>
          Rambabu
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* --- MODIFIED: Use the function for className --- */}
            <Nav.Link as={Link} to="../" onClick={closeNavbar} className={getNavLinkClass('/')}>Home</Nav.Link>
            <Nav.Link as={Link} to="../about" onClick={closeNavbar} className={getNavLinkClass('/about')}>About</Nav.Link>
            <Nav.Link as={Link} to="../projects" onClick={closeNavbar} className={getNavLinkClass('/projects')}>Projects</Nav.Link>
            <Nav.Link as={Link} to="../contacts" onClick={closeNavbar} className={getNavLinkClass('/contacts')}>Contact</Nav.Link>
            <Nav.Link as={Link} to="../login" onClick={closeNavbar} className={getNavLinkClass('/login')}>AdminLogin</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
