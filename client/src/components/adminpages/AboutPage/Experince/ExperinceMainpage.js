import React, { useEffect, useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteExperince,
  getExperiences,
} from "../../../../features/Experince/ExperinceSlice";
import CustomPagination from "../../../common/CustomPagination";
import AddExperince from "./AddExperince";
import { toast } from "react-toastify";
import EditExperince from "./EditExperince";

const ExperinceMainpage = () => {
  const dispatch = useDispatch();
  const { experiences, status, error } = useSelector(
    // Updated to use 'experiences'
    (state) => state.experiences
  );
  // console.log(experiences);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getExperiences()); // Updated dispatch
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  // Pagination create
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const indexoflastPage = currentPage * itemsPerPage;
  const indexofFirstpage = indexoflastPage - itemsPerPage;
  const currentItems = experiences.slice(indexofFirstpage, indexoflastPage); // Use 'experiences'
  const totalPages = Math.ceil(experiences.length / itemsPerPage); // Use 'experiences'
  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerpage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // AddSExperince
  const [showAddExperincModal, setShowAddExperincModal] = useState(false);
  const handleExperince = () => {
    setShowAddExperincModal(true);
  };
  // EditExperince
  const [showEditExperinceModal, setShowEditExperinceModal] = useState(false);
  const [selectedExperienceForEdit, setSelectedExperienceForEdit] = useState(null);
  const hnadleEditExperince = (exp) => {
    setSelectedExperienceForEdit(exp);
    setShowEditExperinceModal(true);
  };
  // deleteExperince
  const handleDeleteExperince = (id) => {
    dispatch(deleteExperince(id))
      .unwrap()
      .then(() => {
        toast.success("Delete Experince successfully!");
        dispatch(getExperiences());
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      })
      .catch((err) => {
        toast.error(`Failed to delete Experince: ${err.message || err}`);
      });
  };

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between m-5">
          <h2>Experince</h2>
          <Button variant="primary" onClick={handleExperince}>
            AddExperince
          </Button>
        </div>
        {status !== "loading" && currentItems && currentItems.length > 0 ? (
          <div className=" m-4 custom-responsive-table-container mb-4 text-center ">
            <Table striped bordered hover className="table-light">
              <thead>
                <tr className="text-center">
                  <th>S.no</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>city</th>
                  <th>state</th>
                  <th>Years</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((exp, i) => (
                  <tr key={exp._id ?? i} className="text-center align-middle">
                    {" "}
                    {/* More robust key, falls back to index if _id is null/undefined */}
                    <td>{indexofFirstpage + i + 1}</td>
                    <td>{exp.Title}</td>
                    <td>{exp.Company}</td>
                    <td>{exp.city}</td>
                    <td>{exp.state}</td>
                    <td>{exp.Years}</td>
                    <td style={{
                      maxWidth: "150px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      textAlign: "center",
                    
}}>{exp.Description}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => hnadleEditExperince(exp)}
                      >
                        {" "}
                        {/* Added me-2 for margin */}
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteExperince(exp._id)}
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
          <p className="text-center mt-3">Loading Experince details...</p>
        ) : (
          <p className="text-center mt-3">No Experince details available.</p>
        )}
      </Container>
      <div className="d-flex justify-content-between m-5">
        <Form.Group
          controlId="itemsPerPageSelect"
          className="d-flex align-items-center"
        >
          <Form.Select
            value={itemsPerPage}
            onChange={handleItemsPerpage}
            style={{ width: "80px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </Form.Select>
        </Form.Group>
        <div>
          {/* pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        </div>
      </div>

      {/* AddExperince */}
      <AddExperince
        show={showAddExperincModal}
        onHide={() => setShowAddExperincModal(false)}
        onSaveSuccess={() => {
          setShowAddExperincModal(false);
          dispatch(getExperiences()); // Updated dispatch
        }}
      />
      <EditExperince
        show={showEditExperinceModal}
        onHide={() => {
          setShowEditExperinceModal(false);
          setSelectedExperienceForEdit(null); // Clear selected experience
        }}
        experienceToEdit={selectedExperienceForEdit}
        onSaveSuccess={() => {
          setShowEditExperinceModal(false);
          setSelectedExperienceForEdit(null); // Clear selected experience
          dispatch(getExperiences()); // Refresh list
        }}
      />
    </>
  );
};

export default ExperinceMainpage;
