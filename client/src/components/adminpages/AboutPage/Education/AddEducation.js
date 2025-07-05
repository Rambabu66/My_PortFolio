// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\components\adminpages\AboutPage\Education\AddEducation.js
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"; // Removed Container, Row, Col; Added Modal
import { useDispatch } from "react-redux";
import { createEducation } from "../../../../features/Education/education"; // Adjust path as needed
import { toast } from "react-toastify";

const AddEducation = ({ show, onHide, onSaveSuccess }) => {
  // Props changed
  const dispatch = useDispatch();
  const initialFormData = {
    Stream: "",
    collegeName: "",
    city: "",
    state: "",
    years: "", // e.g., "2018-2022" or "2020"
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Basic validation (can be expanded)
    if (!formData.Stream || !formData.collegeName || !formData.years) {
      toast.error("Stream, College Name, and Years are required.");
      return;
    }

    dispatch(createEducation(formData)) // <-- Used here
      .unwrap()
      .then(() => {
        toast.success("Education added successfully!");
        if (onSaveSuccess) {
          onSaveSuccess();
        }
        setFormData(initialFormData);
      })
      .catch((err) => {
        // If err is the payload from rejectWithValue (often a string), use err directly.
        toast.error(`Failed to add education: ${err || "An error occurred"}`);
      });
  };

  const handleModalClose = () => {
    setFormData(initialFormData); // Reset form when modal is hidden
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
        <Modal.Title>Add New Education</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit} id="addEducationForm">
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formStream">
            <Form.Label>Stream/Degree</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., B.Tech in Computer Science"
              name="Stream"
              value={formData.Stream}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCollegeName">
            <Form.Label>College/University Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., XYZ University"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Using Form.Row for City and State if you prefer them on the same line, or keep as separate Form.Groups */}
          {/* For simplicity with standard Bootstrap 5, using individual Form.Groups or react-bootstrap Row/Col */}
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="formYears">
            <Form.Label>Years</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., 2018-2022 or Aug 2020 - May 2024"
              name="years"
              value={formData.years}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="addEducationForm">
            Save Education
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEducation;
