import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getEducations,
  deleteEducation,
} from "../../../../features/Education/education"; // Adjust path as needed
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications
import AddEducation from "./AddEducation"; // Import the new modal component
import EditEducation from "./EditEducation";
import CustomPagination from "../../../common/CustomPagination";

const Educationmainpage = () => {
  const dispatch = useDispatch();
  const [showAddEducationModal, setShowAddEducationModal] = useState(false); // Renamed for clarity
  const [showEditEducationModal, setShowEditEducationModal] = useState(false);
  const [selectedEducationForEdit, setSelectedEducationForEdit] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { educations, status, error } = useSelector(
    (state) => state.educations
  ); // Ensure 'educations' matches your store config

  useEffect(() => {
    if (status === "idle") {
      dispatch(getEducations());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error); // Display error messages
    }
  }, [error]);
  // Corrected pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = educations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(educations.length / itemsPerPage);

  const handleChangePages = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //
  const handleChangeItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAddNewEducation = () => {
    setShowAddEducationModal(true); // Show the AddEducation modal
  };

  const handleEditEducation = (id) => {
    const educationToEdit = educations.find((edu) => edu._id === id);
    if (educationToEdit) {
      setSelectedEducationForEdit(educationToEdit);
      setShowEditEducationModal(true);
    } else {
      toast.error("Could not find education data to edit.");
    }
  };

  const handleDeleteEducation = (educationId) => {
    if (
      window.confirm("Are you sure you want to delete this education entry?")
    ) {
      dispatch(deleteEducation(educationId))
        .unwrap()
        .then(() => {
          toast.success("Education entry deleted successfully!");
          if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        })
        .catch((err) => {
          toast.error(`Failed to delete education: ${err.message || err}`);
        });
    }
  };

  if (status === "loading" && currentItems.length === 0) {
    // Show loading only on initial load
    return <p className="text-center mt-3">Loading education details...</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between m-4">
        <h1>Education</h1>
        {/* <Button>Add New Education</Button> */}
        <Button onClick={handleAddNewEducation}>Add New Education</Button>
      </div>

      {status !== "loading" && currentItems && currentItems.length > 0 ? (
        <div className="m-4 custom-responsive-table-container mb-4 text-center">
          <Table striped bordered hover responsive className="table-light">
            <thead>
              <tr className="text-center">
                <th>S.no</th>
                <th></th>
                <th>College Name</th>
                <th>City</th>
                <th>State</th>
                <th>Years</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((edu, i) => (
                <tr key={edu._id ?? i} className="text-center align-middle">
                  {" "}
                  {/* Assuming backend provides _id */}
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>{edu.stream || edu.Stream}</td>{" "}
                  {/* Adjust field names as per your API response */}
                  <td>{edu.collegeName}</td>
                  <td>{edu.city}</td>
                  <td>{edu.state}</td>
                  <td>{edu.years}</td>
                  <td
                    style={{
                      maxWidth: "150px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {edu.description}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditEducation(edu._id)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteEducation(edu._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : status === "loading" ? (
        <p className="text-center mt-3">Loading Education details...</p>
      ) : (
        <p className="text-center mt-3">No Education details available.</p>
      )}

      <div className="d-flex justify-content-between m-5">
        <div>
          <Form.Group
            controlId="itemsPerPageSelect"
            className="d-flex align-items-center"
          >
            <Form.Select
              value={itemsPerPage}
              onChange={handleChangeItemsPerPage}
              style={{ width: "80px" }}
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
              onPageChange={handleChangePages}
            />
          )}
        </div>
      </div>

      <AddEducation
        show={showAddEducationModal}
        onHide={() => setShowAddEducationModal(false)}
        onSaveSuccess={() => {
          setShowAddEducationModal(false);
          // Refresh the list after successful addition
          dispatch(getEducations());
        }}
      />
      <EditEducation
        show={showEditEducationModal}
        onHide={() => {
          setShowEditEducationModal(false);
          setSelectedEducationForEdit(null); // Clear the selected education when modal closes
        }}
        educationToEdit={selectedEducationForEdit} // Pass the whole education object
        onSaveSuccess={() => {
          setShowEditEducationModal(false);
          setSelectedEducationForEdit(null);
          dispatch(getEducations()); // Refresh the list
        }}
      />
    </div>
  );
};

export default Educationmainpage;
