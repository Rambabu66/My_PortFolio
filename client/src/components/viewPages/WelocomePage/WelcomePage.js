import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPrayingHands } from 'react-icons/fa';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <div className="welcome-content">
              <FaPrayingHands className="welcome-icon" />
              <h1 className="welcome-title">Namaste!</h1>
              <p className="welcome-subtitle">
                Welcome to my personal portfolio. I'm glad you're here.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WelcomePage;