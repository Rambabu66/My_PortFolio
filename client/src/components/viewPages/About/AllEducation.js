import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getEducations } from "../../../features/Education/education";

const AllEducation = () => {
  const dispatch = useDispatch();
    const { educations, status, error } = useSelector(
      (state) => state.educations
    );
    useEffect(()=>{
      if(status === "idle"){
        dispatch(getEducations())
      }
    },[status,dispatch])
  return (
    <div className="p-5 m-5">
      <div className="d-flex justify-content-between align-items-center m-3">
        <h2>All Education</h2>
        <Link to="/about">
          <Button variant="primary">Go Back To About Page</Button>
        </Link>
      </div>
      <div className="m-5">
        {educations.map((edu,i) => (
         <Card key={`edu-${i}`} className="mb-4 shadow-sm">
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
      </div>

    </div>
  );
};

export default AllEducation;
