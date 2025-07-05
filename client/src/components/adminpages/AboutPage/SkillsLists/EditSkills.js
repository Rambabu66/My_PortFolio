import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateSkill } from "../../../../features/skills/skillsSlice";
import { toast } from "react-toastify";

const EditSkills = ({ show, onHide, skillToEdit, onSaveSuccess }) => {
    const dispatch = useDispatch();

    const initialFormState = {
        skillName: "",
        skillIcons: "",
        skillDescription: "",
    };
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (skillToEdit && show) {
            setFormData({
                skillName: skillToEdit.skillName || "",
                skillIcons: skillToEdit.skillIcons || "",
                skillDescription: skillToEdit.skillDescription || "",
            });
        } else if (!show) {
            setFormData(initialFormState); // Reset form when modal is hidden
        }
    }, [skillToEdit, show]);

    // HandleChange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleInternalClose = () => {
        setFormData(initialFormState); // Reset form
        setLoading(false);
        onHide(); // Call the onHide passed from parent
    };

    // HandleSubmited
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!skillToEdit || !skillToEdit._id) {
            toast.error("Cannot update skill: Missing skill ID.");
            return;
        }
        if (!formData.skillName) {
            toast.error("Skill Name is required.");
            return;
        }
        setLoading(true);
        const skillData = { ...formData };

        try {
            await dispatch(updateSkill({ id: skillToEdit._id, skillData })).unwrap();
            toast.success("Skill updated successfully!");
            if (onSaveSuccess) onSaveSuccess();
            handleInternalClose(); // Close modal and reset form
        } catch (err) {
             toast.error(`Failed to update skill: ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    };

  return (
    <Modal
      show={show}
      onHide={handleInternalClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Skills</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          {/* Your form fields for editing a skill */}
          <Form.Group className="mb-3">
            <Form.Label>Skill Name</Form.Label>
            <Form.Control
              type="text"
              name="skillName"
              value={formData.skillName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skill Icons</Form.Label>
            <Form.Control
              type="text"
              name="skillIcons"
              value={formData.skillIcons}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skill Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="skillDescription"
              value={formData.skillDescription}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInternalClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditSkills;
