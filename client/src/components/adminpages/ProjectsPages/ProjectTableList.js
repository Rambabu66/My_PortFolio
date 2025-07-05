import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Image,
  Form,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProject,
  getProjects,
} from "../../../features/products/projectSlice";

import CustomPagination from "../../common/CustomPagination";
import { toast } from "react-toastify";

// const truncateText = (text = "", maxLength) => {
//   if (!text || text.length <= maxLength) return text;
//   return text.substr(0, maxLength) + "...";
// };

const ProjectTableList = ({ setShowAddModal, onUpdateClick }) => {
  const dispatch = useDispatch();
  const {
    projects = [],
    status,
    error,
  } = useSelector((state) => state.projects);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 5 items per page
  const [expandedRowId, setExpandedRowId] = useState(null); // State to track expanded row

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // New handler for changing items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Handler to toggle expanded row
  const handleExpandClick = (projectId) => {
    setExpandedRowId(expandedRowId === projectId ? null : projectId);
  };

  const truncateText = (text = "", maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(getProjects());
    }
  }, [status, dispatch]);

  const handleShowAddModal = () => setShowAddModal(true);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  //   DeleteProject
  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(projectId))
        .unwrap()
        .then(() => {
          toast.success("Project deleted successfully");
          // Adjust current page if necessary after deletion to prevent being on an empty page
          const newTotalProjects = projects.length - 1; // Assuming one project is deleted
          const newTotalPages = Math.ceil(newTotalProjects / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else if (newTotalPages === 0) {
            setCurrentPage(1); // If all projects are deleted, go to page 1
          }
        })
        .catch((err) => toast.error(`Deletion failed: ${err.message}`));
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between m-5">
        <h2>Projects</h2>
        <Button variant="primary" onClick={handleShowAddModal}>
          Add To Project
        </Button>
      </div>

      {status !== "loading" && currentItems && currentItems.length > 0 ? (
        <div className="m-4 custom-responsive-table-container mb-4 text-center">
          <Table striped bordered hover responsive className="table-light">
            <thead>
              <tr className="text-center">
                <th></th> {/* For expand button */}
                <th>S.No</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>GitHub</th>
                <th>Live Link</th>
                <th>Tech Stack</th>
                <th>Features</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((project, i) => (
                <React.Fragment key={project._id ?? i}>
                  <tr className="text-center align-middle">
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleExpandClick(project._id)}
                        aria-expanded={expandedRowId === project._id}
                        aria-controls={`expandable-row-${project._id}`}
                      >
                        {expandedRowId === project._id ? (
                          <i className="fas fa-minus"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}
                      </Button>
                    </td>
                    <td>{indexOfFirstItem + i + 1}</td>
                    <td>
                      {project?.projectMultiImages &&
                      project.projectMultiImages.length > 0 ? (
                        <Image
                          // Ensure the URL is correct based on your backend/Cloudinary setup
                          src={
                            typeof project.projectMultiImages[0] === "string"
                              ? project.projectMultiImages[0]
                              : project.projectMultiImages[0]?.url
                          }
                          alt={project.projectName || "Project image"}
                          style={{
                            width: "100px",
                            height: "auto",
                            objectFit: "cover",
                          }}
                          rounded
                          fluid
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td style={{ minWidth: "150px" }}>
                      {project.projectName ?? "N/A"}
                    </td>
                    <td
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "left",
                      }}
                      title={project.projectDescription}
                    >
                      {truncateText(project.projectDescription, 50)}
                    </td>
                    <td>
                      <a
                        href={project.projectGitHubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </a>
                    </td>
                    <td>
                      <a
                        href={project.projectLiveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </a>
                    </td>
                    <td style={{ minWidth: "150px" }}>
                      {truncateText(project.projectTechStack, 30)}
                    </td>
                    <td
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "left",
                      }}
                      title={project.projectFeatures}
                    >
                      {truncateText(project.projectFeatures, 50)}
                    </td>
                    <td>
                      <Button
                        className="me-2"
                        variant="warning"
                        onClick={() => onUpdateClick(project)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteProject(project._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                  {expandedRowId === project._id && (
                    <tr
                      id={`expandable-row-${project._id}`}
                      className="expanded-row"
                    >
                      <td colSpan="10" className="p-0">
                        <div className="p-3 bg-light border-top">
                          <Row>
                            <Col md={12}>
                              <h4>{project.projectName} - Details</h4>
                              <hr />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={8}>
                              <dl className="row">
                                <dt className="col-sm-3">Description</dt>
                                <dd
                                  className="col-sm-9"
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {project.projectDescription ||
                                    "No description available."}
                                </dd>

                                <dt className="col-sm-3 mt-2">Features</dt>
                                <dd
                                  className="col-sm-9 mt-2"
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {project.projectFeatures ||
                                    "No features listed."}
                                </dd>

                                <dt className="col-sm-3 mt-2">Tech Stack</dt>
                                <dd className="col-sm-9 mt-2">
                                  {project.projectTechStack ||
                                    "No tech stack specified."}
                                </dd>

                                <dt className="col-sm-3 mt-2">GitHub</dt>
                                <dd className="col-sm-9 mt-2">
                                  {project.projectGitHubLink ? (
                                    <a
                                      href={project.projectGitHubLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {project.projectGitHubLink}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </dd>

                                <dt className="col-sm-3 mt-2">Live Link</dt>
                                <dd className="col-sm-9 mt-2">
                                  {project.projectLiveLink ? (
                                    <a
                                      href={project.projectLiveLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {project.projectLiveLink}
                                    </a>
                                  ) : (
                                    "N/A"
                                  )}
                                </dd>
                              </dl>
                            </Col>
                            <Col md={4}>
                              <h5>Project Images</h5>
                              {project.projectMultiImages &&
                              project.projectMultiImages.length > 0 ? (
                                <Row>
                                  {project.projectMultiImages.map(
                                    (img, index) => (
                                      <Col
                                        key={index}
                                        xs={6}
                                        md={6}
                                        lg={4}
                                        className="mb-3"
                                      >
                                        <Image
                                          src={
                                            typeof img === "string"
                                              ? img
                                              : img?.url
                                          }
                                          alt={`Project image ${index + 1}`}
                                          fluid
                                          rounded
                                          thumbnail
                                        />
                                      </Col>
                                    )
                                  )}
                                </Row>
                              ) : (
                                <p>No additional images.</p>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
            {/* Add another row outside of thead and tbody but still within the Table component */}
            <tfoot>
              <tr>
                <td colSpan="10" className="text-center">
                  {/* You can customize the content here */}
                  <div className="d-flex justify-content-between m-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        // Add functionality here, e.g., refresh the table
                        dispatch(getProjects());
                        toast.info("Refreshing projects...");
                      }}
                    >
                      Refresh Table
                    </Button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      ) : status === "loading" ? (
        <p className="text-center mt-3">Loading Projects...</p>
      ) : (
        <p className="text-center mt-3">No Projects available</p>
      )}
      <div className="d-flex justify-content-between m-5">
        <div>
          {/* Add the items per page control */}

          <Form.Group
            controlId="itemsPerPageSelect"
            className="d-flex align-items-center"
          >
            {/* <Form.Label className="me-2 mb-0">Items per page:</Form.Label> */}
            <Form.Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ width: "80px" }} // Adjust width as needed
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div>
          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default ProjectTableList;
