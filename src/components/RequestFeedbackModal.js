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
    <div className="modal-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className={success ? 'white-modal' : 'modal-content request-feedback-modal'} style={success ? { backgroundColor: 'white' } : {}}>
        {success ? (
          <div style={{ backgroundColor: 'white' }}>
            <p style={{
              color: '#000',
              backgroundColor: 'white', 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              margin: '50px auto 30px',
              maxWidth: '480px',
              textAlign: 'center'
            }}>
              Thank you for your submission. You will receive your interview feedback via email within 1-2 business days. Please monitor your inbox for a message from 3Hire.
            </p>
            <button 
              onClick={handleClose}
              style={{
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                padding: '10px 25px',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
                margin: '0 auto',
                display: 'block'
              }}
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
              
              <div className="modal-actions" style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 15px',
                    width: '120px',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    lineHeight: 'normal'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 15px',
                    width: '200px',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    lineHeight: 'normal',
                    whiteSpace: 'nowrap'
                  }}
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