import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { editExperince } from '../../../../features/Experince/ExperinceSlice';

const EditExperince = ({ show, onHide, experienceToEdit, onSaveSuccess }) => {
  const dispatch = useDispatch();

  const initialFormData = {
    Title: '',
    Company: '',
    city: '',
    state: '',
    Years: '',
    Description: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (show && experienceToEdit) {
      setFormData({
        Title: experienceToEdit.Title || '',
        Company: experienceToEdit.Company || '',
        city: experienceToEdit.city || '',
        state: experienceToEdit.state || '',
        Years: experienceToEdit.Years || '',
        Description: experienceToEdit.Description || '',
      });
    } else if (!show) {
      setFormData(initialFormData); // Reset form when modal is hidden
    }
  }, [show, experienceToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.Title || !formData.Company || !formData.city || !formData.state || !formData.Years) {
      toast.error('Title, Company, City, State, and Years are required.');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!experienceToEdit || !experienceToEdit._id) {
      toast.error('Cannot update experience: Missing experience ID.');
      return;
    }

    setIsSaving(true);

    try {
      await dispatch(editExperince({ id: experienceToEdit._id, experinceData: formData })).unwrap();
      toast.success('Experience updated successfully!');
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      handleInternalClose(); // Close modal and reset form
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || JSON.stringify(err) || 'An error occurred';
      toast.error(`Failed to update experience: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInternalClose = () => {
    setFormData(initialFormData);
    setIsSaving(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleInternalClose} centered keyboard={false} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Experience</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formEditJobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control type="text" placeholder="Enter job title" name="Title" value={formData.Title} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEditCompanyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" placeholder="Enter company name" name="Company" value={formData.Company} onChange={handleChange} required />
          </Form.Group>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formEditCity">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="Enter City" name="city" value={formData.city} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3" controlId="formEditState">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" placeholder="Enter State" name="state" value={formData.state} onChange={handleChange} required />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="formEditYears">
            <Form.Label>Years</Form.Label>
            <Form.Control type="text" placeholder="e.g., 2020-2023 or Jan 2020 - Present" name="Years" value={formData.Years} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEditDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="Description" value={formData.Description} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInternalClose}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditExperince;