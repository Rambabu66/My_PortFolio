import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSkills,
  getSkills,
} from "../../../../features/skills/skillsSlice";
import CustomPagination from "../../../common/CustomPagination";
import { toast } from "react-toastify";
import AddSkills from "./AddSkills";
import EditSkills from "./EditSkills";
import SkillIconRenderer from "./SkillIconRenderer";

const SkillsMainpage = () => {
  const dispatch = useDispatch();
  const { skills, status, error } = useSelector((state) => state.skills);
  // add skills
  const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);
  const handleSkills = () => {
    setShowAddSkillsModal(true);
  };
  // edit skills
  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [selectedSkillForEdit, setSelectedSkillForEdit] = useState(null);

  const handleEditSkills = (skillId) => {
    const skillToEdit = skills.find((skill) => skill._id === skillId);
    if (skillToEdit) {
      setSelectedSkillForEdit(skillToEdit);
      setShowEditSkillsModal(true);
    } else {
      toast.error("Could not find skill data to edit.");
    }
  };

  // Expend
  const [expandedRowId, setExpandedRowId] = useState(null); // State to track expanded row
  const handleExpandClick = (skillId) => {
    setExpandedRowId(expandedRowId === skillId ? null : skillId);
  };
  const truncateText = (text = "", maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemesperpage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = skills.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
  ); // Corrected slicing for last page
  const totalPages = Math.ceil(skills.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // New handler for changing items per page
  const handleperPageChnage = (e) => {
    setItemesperpage(Number(e.target.value));
    setCurrentPage(1);
  };

  // get data
  useEffect(() => {
    if (status === "idle") {
      dispatch(getSkills());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  // DeleteHandle
  const handleDelete = (id) => {
    dispatch(deleteSkills(id))
      .unwrap()
      .then(() => {
        toast.success("Delete Succussfully skills");
        // Adjust current page if necessary after deletion
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      })
      .catch((err) => {
        toast.error(`Failed to delete education: ${err.message || err}`);
      });
  };
  return (
    <>
      <Container>
        <div className="d-flex justify-content-between m-5">
          <h2>Skill</h2>
          <Button variant="primary" onClick={handleSkills}>
            Add to Skills
          </Button>
        </div>
        {status !== "loading" && currentItems && currentItems.length > 0 ? (
          <div className=" m-4 custom-responsive-table-container mb-4 text-center ">
            <Table striped bordered hover responsive className="table-light">
              <thead>
                <tr className="text-center">
                  <th></th> {/* For expand button */}
                  <th>S.no</th>
                  <th>skillName</th>
                  <th>skillIcons</th>
                  <th>skillDescription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((skill, i) => (
                  <>
                    <tr
                      key={skill._id ?? i}
                      className="text-center align-middle"
                    >
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleExpandClick(skill._id)}
                          aria-expanded
                        >
                          {expandedRowId === skill._id ? (
                            <i className="fas fa-minus"></i>
                          ) : (
                            <i className="fas fa-plus"></i>
                          )}
                        </Button>
                      </td>
                      <td>{indexOfFirstItem + i + 1}</td>
                      <td>{skill.skillName}</td>
                      <td>
                        <SkillIconRenderer
                          skillIcon={skill.skillIcons}
                          skillName={skill.skillName}
                        />
                      </td>

                      <td
                        style={{
                          maxWidth: "120px",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          textAlign: "center",
                        }}
                      >
                        {skill.skillDescription}
                      </td>

                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditSkills(skill._id)}
                        >
                          Edit
                        </Button>{" "}
                        {""}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(skill._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                    {expandedRowId === skill._id && (
                      <tr
                        id={`expandable-row-${skill._id}`}
                        className="expanded-row"
                      >
                        <td colSpan="10" className="p-0">
                          <div className="p-3 bg-light border-top">
                            <Row>
                              <Col >
                              <h4>{skill.skillName} - Details</h4>
                              <hr />
                              </Col>
                            </Row>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </Table>
          </div>
        ) : status === "loading" ? (
          <p className="text-center mt-3">Loading Skills details...</p>
        ) : (
          <p className="text-center mt-3">No Skills details available.</p>
        )}
      </Container>
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
              onChange={handleperPageChnage}
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

      {/* AddSkills */}
      <AddSkills
        show={showAddSkillsModal}
        onHide={() => setShowAddSkillsModal(false)}
        onSaveSuccess={() => {
          setShowAddSkillsModal(false);
          dispatch(getSkills());
        }}
      />
      <EditSkills
        show={showEditSkillsModal}
        onHide={() => {
          setShowEditSkillsModal(false);
          setSelectedSkillForEdit(null); // Clear selected skill
        }}
        skillToEdit={selectedSkillForEdit}
        onSaveSuccess={() => {
          setShowEditSkillsModal(false);
          setSelectedSkillForEdit(null); // Clear selected skill
          dispatch(getSkills()); // Refresh list
        }}
      />
    </>
  );
};

export default SkillsMainpage;
