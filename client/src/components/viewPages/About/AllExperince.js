import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExperiences } from '../../../features/Experince/ExperinceSlice';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AllExperince = () => {
    const dispatch = useDispatch()
     const {  experiences, status, error } = useSelector(
        (state) => state.experiences
      );
      useEffect(() =>{
        if(status === "idle") {
            dispatch(getExperiences())
        }
      }, [dispatch, status]);
  return (
     <div className='p-5 m-5 '>
        <div className='d-flex justify-content-between align-items-center m-3'>
            <h3 className=" text-center text-md-start">Experience</h3>
            <Link to="/about">
            <Button variant="secondary" >Go Back To About Page</Button>
            </Link>
        </div>
      <div className='m-5'>
      { experiences.map((exp, index) => (
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
      </div>
    </div>
  )
}

export default AllExperince