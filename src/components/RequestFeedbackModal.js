import React, { useState } from 'react';
import './RequestFeedbackModal.css';
import { addUserEntry } from '../api/dynamo';

const RequestFeedbackModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Please provide both name and email');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await addUserEntry({
        name,
        email,
        strengths: '', // Will be filled later by admin
        weaknesses: '' // Will be filled later by admin
      });
      
      setSuccess(true);
      
      // Set a timeout to automatically close the modal after 10 seconds
      setTimeout(() => {
        handleClose();
      }, 10000);
    } catch (err) {
      console.error('Error requesting feedback:', err);
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content request-feedback-modal">
        {success ? (
          <div className="success-message">
            <p>You are expected to receive email notification about your interview feedback in 1-2 business days. Keep alert on your email box from 3hire.</p>
            <button 
              className="close-button"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <button className="modal-close" onClick={handleClose}>×</button>
            <h2>Request Interview Feedback</h2>
            <p>Enter your information below to request personalized interview feedback. If you've interviewed with us, we'll prepare your feedback within 24 hours.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              {error && <p className="error-message">{error}</p>}
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Feedback'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestFeedbackModal;