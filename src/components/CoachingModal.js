// src/components/CoachingModal.js
import React from "react";
import "./CoachingModal.css";

function CoachingModal({ onClose }) {
  return (
    <div className="coaching-modal-overlay">
      <div className="coaching-modal">
        <div className="coaching-modal-header">
          <h2>Book a Coaching Session</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="coaching-content">
          <p>Ready to take your interview skills to the next level? Book a personalized coaching session to address your specific needs and challenges.</p>
          
          <div className="coaching-options">
            <div className="payment-option">
              <h3>Pay for Coaching</h3>
              <p className="payment-id">$99 - 30 Minute Session</p>
              <div className="qr-container">
                <img 
                  src="/coaching_99.jpg" 
                  alt="Coaching payment QR code" 
                  className="qr-code"
                />
                <p>Scan QR code to pay</p>
              </div>
            </div>
            
            <div className="calendly-option">
              <h3>Schedule Your Session</h3>
              <p>After payment, schedule a time that works for you:</p>
              <a 
                href="https://calendly.com/smiqua-zhou/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="calendly-button"
              >
                Book on Calendly
              </a>
            </div>
          </div>
          
          <p className="coaching-details">
            <strong>What to expect:</strong> Personalized feedback, targeted practice, actionable strategies, and immediate improvements in your interview performance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CoachingModal;