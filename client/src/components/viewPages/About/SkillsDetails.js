import React, {  useEffect, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSkills } from '../../../features/skills/skillsSlice';
import { Card, Col, Container, Image, Row} from 'react-bootstrap';

const SkillsDetails = () => {
    
    const dispatch = useDispatch();
    const {
      skills,
      status,
      error,
    } = useSelector((state) => state.skills);
    // console.log(skills);
    
    useEffect(() => {
      if (status === "idle") {
        dispatch(getSkills());
      }
    }, [status, dispatch]);

  return (
    <>
      {/* --- Skills Section --- */}
          <section className='skills-section py-5'>
            <Container>
           
            <div className="d-block d-md-flex align-items-md-center mb-5">
                <h2 className='text-center text-md-start mb-4 mb-md-0 me-md-4'>Skills Acquired</h2>
                {/* HR: Hidden by default, visible and grows on medium+ */}
                <hr className="d-none d-md-block flex-grow-1" />
              </div>
             
              
                <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
                  {skills.map((skill) => (
                    <Col key={skill._id || skill.skillName} className="d-flex">
                      <Card className="text-center w-100 shadow-sm h-100">
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                          {skill.skillIcons ? (
                            skill.skillIcons.startsWith('http') || skill.skillIcons.startsWith('/') ? (
                              <Image
                                src={skill.skillIcons}
                                alt={`${skill.skillName} icon`}
                                style={{ width: '48px', height: '48px', marginBottom: '1rem', objectFit: 'contain' }} // Adjusted size
                              />
                            ) : (
                              <i className={`${skill.skillIcons} fa-3x mb-3 text-primary`} title={skill.skillName}></i>
                            )
                          ) : (
                            <span className="fa-3x mb-3 text-muted"><i className="fas fa-tools"></i></span> // Placeholder icon
                          )}
                          <Card.Title className="fw-bold">{skill.skillName}</Card.Title>
                          {/* <Card.Text className="text-muted">{skill.level}</Card.Text> // Assuming level is not part of fetched skill */}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
            </Container>
          </section>
    </>
  )
}

export default SkillsDetails