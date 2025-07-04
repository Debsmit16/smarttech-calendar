import React, { useState } from 'react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxTeamSize: 4,
    minTeamSize: 2,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating event:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-event-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div className="modal-header">
          <h2 className="modal-title">Create New Event</h2>
          <p className="modal-subtitle">Set up your hackathon event details</p>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter event title"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe your hackathon event"
                rows={4}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="theme" className="form-label">Theme</label>
              <input
                type="text"
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., AI & Machine Learning"
              />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="registrationDeadline" className="form-label">Registration Deadline</label>
              <input
                type="datetime-local"
                id="registrationDeadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="minTeamSize" className="form-label">Min Team Size</label>
              <input
                type="number"
                id="minTeamSize"
                name="minTeamSize"
                value={formData.minTeamSize}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="10"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="maxTeamSize" className="form-label">Max Team Size</label>
              <input
                type="number"
                id="maxTeamSize"
                name="maxTeamSize"
                value={formData.maxTeamSize}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="10"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
