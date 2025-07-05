import React, { useEffect } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getExperiences } from "../../../features/Experince/ExperinceSlice";
import { Link } from "react-router-dom";



const ExperinceDetails = () => {
  const dispatch = useDispatch();
  const {  experiences, status, error } = useSelector(
    (state) => state.experiences
  );
//   console.log(experiences);
  useEffect(() =>{
    if (status === "idle") {
      dispatch(getExperiences());
    }
  },[status,dispatch])
  
  const visibleExperiences = experiences;
  const displayedExperiences = visibleExperiences.slice(0, 4);


  return (
    <>
      <h3 className="mb-4 text-center text-md-start">Experience</h3>
      { displayedExperiences.map((exp, index) => (
        <Card key={`exp-${index}`} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title className="fw-bold">{exp.Title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{exp.Company} |  | {exp.city}{exp.state ? `, ${exp.state}` : ''}</Card.Subtitle>
            <Card.Text>
              <small className="text-muted">{exp.Years}</small>
            </Card.Text>
           {exp.Description && (
                                 <Card.Text className="mt-2">{exp.Description}</Card.Text>
                               )}
          </Card.Body>
        </Card>
      ))}
      {
        visibleExperiences.length > 0 && (
          <Link to="/allExperince">
            <Button>View All Experince</Button>
          </Link>
        )
      }
     

      {visibleExperiences.lenght > 0 && (
        <Row className="mt-5"> {/* Add margin top */}
              <Col className="text-center"> {/* Center the content of this column */}
                <Link to="/projects">
                  <Button variant="primary" size="lg">View All Projects</Button>
                </Link>
              </Col>
            </Row>
      ) }
    </>
  );
};

export default ExperinceDetails;
