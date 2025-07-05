import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify"; // Make sure react-toastify is installed and configured
import { createExperience } from "../../../../features/Experince/ExperinceSlice"; // Updated import

const AddExperince = ({ show, onHide, onSaveSuccess }) => {
  const dispatch = useDispatch();
  const initialFormData = {
    Title: "",
    Company: "",
    city: "",
    state: "",
    Years: "",
    Description: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false); // State to track saving status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Basic validation function
  const validateForm = () => {
    if (!formData.Title || !formData.Company || !formData.city || !formData.state || !formData.Years) {
      toast.error("Title, Company, City, State, and Years are required."); // Corrected message
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true); // Start saving

    dispatch(createExperience(formData)) // Use updated thunk name
      .unwrap()
      .then(() => {
        toast.success("Experince added successfully");
        if (onSaveSuccess) {
          onSaveSuccess();
        }
        // Form reset and modal close handled by onSaveSuccess/onHide in parent
      })
      .catch((err) => {
        // Use err.message if available, otherwise the payload, or a generic message
        const errorMessage = typeof err === 'string' ? err : (err.message || JSON.stringify(err) || "An error occurred");
        toast.error(`Failed to add experience: ${errorMessage}`);
      })
      .finally(() => {
        setIsSaving(false); // End saving
      });
  };

  const handleModalClose = () => {
    setFormData(initialFormData);
    onHide();
  };

  // Optional: Add a useEffect to clear error state from slice if needed,
  // though toast handles immediate feedback well.
  // const { error: sliceError } = useSelector((state) => state.experiences);
  // useEffect(() => {
  //   if (sliceError) {
  //     // Handle slice error if necessary, maybe clear it after showing toast
  //     // dispatch(clearExperienceError()); // Assuming you have this action
  //   }
  // }, [sliceError, dispatch]);

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered
      size="lg" // Added size for better form layout
      keyboard={false}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Experince</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit} id="addExperinceForm">
          <Form.Group className="mb-3" controlId="formBasicJobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control type="text" placeholder="Enter job title" name="Title" value={formData.Title} onChange={handleChange}  />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicComanyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter company name"
              name="Company"
              value={formData.Company}
              onChange={handleChange}
              
            />
          </Form.Group>
          <div className="row">
            <div className="col mb-6">
              <Form.Group className="mb-3" controlId="formBasicCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  
                />
              </Form.Group>
            </div>
            <div className="col mb-6">
              <Form.Group className="mb-3" controlId="formBasicState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  
                />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="formBasicYears">
            <Form.Label>Years</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., 2020-2023 or Jan 2020 - Present"
              name="Years"
              value={formData.Years}
              onChange={handleChange}
              
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              // Description is optional, so no '' here
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="addExperinceForm"
          disabled={isSaving} // Disable button while saving
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddExperince;
