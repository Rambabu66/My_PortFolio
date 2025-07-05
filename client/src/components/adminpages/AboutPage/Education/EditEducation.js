import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  updateEducation
} from "../../../../features/Education/education"; // Adjust path as needed
import { toast } from "react-toastify";

const EditEducation = ({ show, onHide, educationToEdit, onSaveSuccess }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.educations); // Status and error for update op

  const initialFormData = {
    Stream: "",
    collegeName: "",
    city: "",
    state: "",
    years: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Populate form when modal is shown and educationToEdit data is available
    if (show && educationToEdit) {
      setFormData({
        Stream: educationToEdit.Stream || educationToEdit.stream || "", // Handle potential case differences
        collegeName: educationToEdit.collegeName || "",
        city: educationToEdit.city || "",
        state: educationToEdit.state || "",
        years: educationToEdit.years || "",
        description: educationToEdit.description || "",
      });
    } else if (!show) {
      setFormData(initialFormData); // Reset form when modal is hidden
    }
  }, [show, educationToEdit]);

  // useEffect to handle general errors from the slice, if any were to be displayed here.
  // For update errors, the .catch() in handleFormSubmit is more direct.
  // If you had other errors from the 'educations' slice you wanted to display here, you could add:
  // useEffect(() => { if (error) { toast.error(`An error occurred: ${error}`); dispatch(clearEducationError()); } }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.Stream || !formData.collegeName || !formData.years) {
      toast.error("Stream, College Name, and Years are required.");
      return;
    }

    if (!educationToEdit || !educationToEdit._id) {
      toast.error("Cannot update education: Missing education ID.");
      return;
    }

    dispatch(updateEducation({ educationId: educationToEdit._id, updates: formData }))
      .unwrap()
      .then(() => {
        toast.success("Education updated successfully!");
        if (onSaveSuccess) {
          onSaveSuccess();
        }
        onHide(); // Close modal on success
      })
      .catch((err) => {
        const errorMessage = typeof err === 'string' ? err : (err.message || "An error occurred");
        toast.error(`Failed to update education: ${errorMessage}`);
      });
  };

  const handleModalClose = () => {
    setFormData(initialFormData); // Reset form
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Education</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit} id="editEducationForm">
        <Modal.Body>
          {/* Removed loading message for getEducationById as it's no longer used */}
          {/* Form fields similar to AddEducation, but populated with formData */}
          <Form.Group className="mb-3" controlId="formStreamEdit">
            <Form.Label>Stream/Degree</Form.Label>
            <Form.Control type="text" name="Stream" value={formData.Stream} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCollegeNameEdit">
            <Form.Label>College/University Name</Form.Label>
            <Form.Control type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} required />
          </Form.Group>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formCityEdit"><Form.Label>City</Form.Label><Form.Control type="text" name="city" value={formData.city} onChange={handleChange} /></Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formStateEdit"><Form.Label>State</Form.Label><Form.Control type="text" name="state" value={formData.state} onChange={handleChange} /></Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="formYearsEdit">
            <Form.Label>Years</Form.Label>
            <Form.Control type="text" name="years" value={formData.years} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescriptionEdit">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="editEducationForm" disabled={status === 'loading'}>
            {status === 'loading' ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditEducation;