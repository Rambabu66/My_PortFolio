import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // To link to detail pages
import {
  FaProjectDiagram,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
} from "react-icons/fa"; // Example icons

// Assuming you have these actions and selectors in your Redux slices
// If not, you'll need to create them similar to projectSlice
import { getProjects } from "../../../features/products/projectSlice";
// You'll need to create/import these for other sections:
import { getSkills } from "../../../features/skills/skillsSlice";

import { getEducations } from "../../../features/Education/education";
import { getExperiences } from "../../../features/Experince/ExperinceSlice";
const HomePage = () => {
  const dispatch = useDispatch();

  // Selectors for projects
  const {
    projects,
    status: projectsStatus,
    error: projectsError,
  } = useSelector((state) => state.projects);

  // --- Mock Selectors for other sections ---
  // Replace these with actual selectors once you have the slices
  const {
    skills,
    status: skillsStatus,
    error: skillsError,
  } = useSelector((state) => state.skills);
  const {
    educations,
    status: educationsStatus,
    error: educationsError,
  } = useSelector((state) => state.educations);
  const {
    experiences,
    status: experiencesStatus,
    error: experiencesError,
  } = useSelector(
    // Updated to use 'experiences'
    (state) => state.experiences
  );
  // --- End Mock Selectors ---

  useEffect(() => {
    if (projectsStatus === "idle") {
      dispatch(getProjects());
    }
    // Dispatch actions for other sections if their status is 'idle'
    if (skillsStatus === "idle") {
      dispatch(getSkills());
    }
    if (educationsStatus === "idle") {
      dispatch(getEducations());
    }
    if (experiencesStatus === "idle") {
      dispatch(getExperiences());
    }
  }, [
    projectsStatus,
    skillsStatus,
    educationsStatus,
    experiencesStatus,
    dispatch,
  ]);

  const isLoading =
    projectsStatus === "loading" ||
    skillsStatus === "loading" ||
    educationsStatus === "loading" ||
    experiencesStatus === "loading";
  const hasError = projectsError || educationsError || experiencesError;

  const summaryData = [
    {
      title: "Total Projects",
      count: projects?.length || 0,
      link: "/admin/projectspage", // Adjust link as per your routing
      icon: <FaProjectDiagram size={30} className="mb-2" />,
      status: projectsStatus,
      error: projectsError,
    },
    {
      title: "Total Skills",
      count: skills?.length || 0,
      link: "/admin/skillspage", // Adjust link
      icon: <FaTools size={30} className="mb-2" />,
      status: skillsStatus,
      error: skillsError,
    },
    {
      title: "Total Education Entries",
      count: educations?.length || 0,
      link: "/admin/educationpage", // Adjust link
      icon: <FaGraduationCap size={30} className="mb-2" />,
      status: educationsStatus,
      error: educationsError,
    },
    {
      title: "Total Experience Entries",
      count: experiences?.length || 0,
      link: "/admin/experincepage", // Adjust link
      icon: <FaBriefcase size={30} className="mb-2" />,
      status: experiencesStatus,
      error: experiencesError,
    },
  ];

  if (
    isLoading &&
    !projects?.length &&
    !skills?.length &&
    !educations?.length &&
    !experiences?.length
  ) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading dashboard data...</span>
        </Spinner>
        <p>Loading dashboard data...</p>
      </Container>
    );
  }

  // A general error for initial load, more specific errors can be shown per card
  if (
    hasError &&
    !projects?.length &&
    !skills?.length &&
    !educations?.length &&
    !experiences?.length
  ) {
    return (
      <Container className="mt-3">
        <Alert variant="danger">
          Error loading dashboard data. Please try again later.
          {projectsError && <p>Projects: {projectsError}</p>}
          {skillsError && <p>Skills: {skillsError}</p>}
          {educationsError && <p>Education: {educationsError}</p>}
          {experiencesError && <p>Experience: {experiencesError}</p>}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-5 ">
      <h1 className="mb-4">Admin Dashboard</h1>
      <Row xs={1} md={2} lg={4} className="g-4">
        {summaryData.map((item, index) => (
          <Col key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center d-flex flex-column justify-content-between">
                <div>
                  {item.icon}
                  <Card.Title>{item.title}</Card.Title>
                  {item.status === "loading" ? (
                    <Spinner animation="border" size="sm" />
                  ) : item.status === "failed" ? (
                    <p className="text-danger small">Error loading</p>
                  ) : (
                    <Card.Text as="h2" className="my-2">
                      {item.count}
                    </Card.Text>
                  )}
                </div>
                <Button
                  as={Link}
                  to={item.link}
                  variant="primary"
                  className="mt-3"
                >
                  Manage{" "}
                  {item.title.replace("Total ", "").replace(" Entries", "")}
                </Button>
              </Card.Body>
              {item.status === "failed" && item.error && (
                <Card.Footer className="bg-danger-soft text-danger small">
                  Error:{" "}
                  {typeof item.error === "string"
                    ? item.error
                    : JSON.stringify(item.error)}
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      {/* Display a general loading indicator if any section is still loading new data after initial display */}
      {isLoading &&
        (projects?.length > 0 ||
          skills?.length > 0 ||
          educations?.length > 0 ||
          experiences?.length > 0) && (
          <div className="text-center mt-4">
            <Spinner animation="border" size="sm" /> Refreshing data...
          </div>
        )}
    </Container>
  );
};

export default HomePage;
