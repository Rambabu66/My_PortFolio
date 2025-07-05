import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPrayingHands } from 'react-icons/fa';
import './WelcomePage.css';

const WelcomePage = ({ onEnter }) => {
  return (
    <div className="welcome-container">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <div className="welcome-content">
              <FaPrayingHands className="welcome-icon" aria-hidden="true" />
              <h1 className="welcome-title">Namaste!</h1>
              <p className="welcome-subtitle">
                Welcome to my personal portfolio. I'm glad you're here.
              </p>
              <Button
                variant="primary"
                className="enter-button"
                onClick={onEnter}
              >
                Enter Site
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WelcomePage;