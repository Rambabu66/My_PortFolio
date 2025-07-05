// Hypothetical content for AddSkills.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // ... other imports
import { useDispatch } from 'react-redux';
import { createSkill } from '../../../../features/skills/skillsSlice'; // Import the createSkill thunk
import { toast } from 'react-toastify';

const AddSkills = ({ show, onHide, onSaveSuccess }) => {
  const dispatch = useDispatch();

  const initialFormState = {
    skillName: '',
    skillIcons: '', // Assuming this is a string (class name or URL)
    skillDescription: '',
  };

  // State for form inputs
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false); // State to manage loading/submitting state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleInternalClose = () => {
    // Reset form state
    setFormData(initialFormState);
    setLoading(false); // Reset loading state
    onHide(); // This calls the onHide passed from SkillsMainpage.js
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    const skillData = { ...formData };

    try {
      await dispatch(createSkill(skillData)).unwrap(); // skillData now comes from formData
      toast.success("Skill added successfully!");
      if (onSaveSuccess) onSaveSuccess(); // Call the success callback from parent
      handleInternalClose(); // Close modal on success
    } catch (err) {
      toast.error(`Failed to add skill: ${err.message || err}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleInternalClose} // Crucial: Wire Modal's onHide to your handler or directly to the onHide prop
      centered
      backdrop="static" // Optional: if you want to prevent closing on backdrop click
      keyboard={false}  // Optional: if you want to prevent closing on Escape key
    >
      <Modal.Header closeButton> {/* This enables the 'X' button */}
        <Modal.Title>Add New Skill</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          {/* Your form fields for adding a skill */}
          <Form.Group className="mb-3">
            <Form.Label>Skill Name</Form.Label>
            <Form.Control
              type="text"
              name="skillName" // Added name attribute
              value={formData.skillName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skill Icons</Form.Label>
            <Form.Control
              type="text"
              name="skillIcons" // Added name attribute
              value={formData.skillIcons}
              onChange={handleChange}
            />
          </Form.Group>
         <Form.Group>
          <Form.Label>Skill Description</Form.Label>
          <Form.Control
            as="textarea"
            name="skillDescription" // Added name attribute
            rows={3}
            value={formData.skillDescription}
            onChange={handleChange}
          />
         </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInternalClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {loading ? 'Saving...' : 'Save Skill'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddSkills;
