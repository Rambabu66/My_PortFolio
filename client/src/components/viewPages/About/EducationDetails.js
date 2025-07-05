import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { getEducations } from "../../../features/Education/education";
import { useDispatch, useSelector } from "react-redux";
import {Link} from "react-router-dom"

const EducationDetails = () => {
  const dispatch = useDispatch();
  const { educations, status, error } = useSelector(
    (state) => state.educations
  );
  useEffect(() => {
    if (status === "idle") {
      dispatch(getEducations());
    }
  }, [status, dispatch]);

  const viewAlleducation = educations;
  const dispalyAllEducation = viewAlleducation.slice(0, 4);
  return (
    <>
      <h3 className="mb-4 text-center text-md-start">Education</h3>
      {dispalyAllEducation.map((edu, index) => (
        <Card key={`edu-${index}`} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title className="fw-bold">{edu.Stream}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {edu.collegeName} | {edu.city}
              {edu.state ? `, ${edu.state}` : ""}
            </Card.Subtitle>
            <Card.Text>
              <small className="text-muted">{edu.years}</small>
            </Card.Text>
            {edu.description && (
              <Card.Text className="mt-2">{edu.description}</Card.Text>
            )}
          </Card.Body>
        </Card>
      ))}
      {viewAlleducation.length > 0 && (
        <Link to="/allEducation">
          <Button>View All Education</Button>
        </Link>
      )}
    </>
  );
};

export default EducationDetails;
