// src/components/CareerTransitionModal.js
import React from "react";
import "./CareerTransitionModal.css";

function CareerTransitionModal({ onClose }) {
  return (
    <div className="career-transition-modal-overlay">
      <div className="career-transition-modal">
        <div className="career-transition-modal-header">
          <h2>Career Transition Program</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="career-transition-content">
          <p>Join our 6-month Career Transition Program designed to help you navigate your path to a new career with confidence and support.</p>
          
          <div className="payment-option">
            <h3>Program Details</h3>
            <p className="payment-id">$99/month - 6 Month Program</p>
            <div className="qr-container">
              <img 
                src="/images/Group Career Support.jpg" 
                alt="Career Transition payment QR code" 
                className="qr-code"
              />
              <p>Scan QR code to subscribe</p>
            </div>
          </div>
          
          <div className="program-details">
            <h3>What's Included:</h3>
            <ul>
              <li>Weekly group coaching sessions</li>
              <li>Career transition strategy planning</li>
              <li>Resume and LinkedIn profile optimization</li>
              <li>Interview preparation and practice</li>
              <li>Networking strategies and support</li>
              <li>Access to career resources and tools</li>
            </ul>
          </div>
          
          <p className="transition-note">
            <strong>Note:</strong> After payment, you will receive an email with program details and access to our online community.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CareerTransitionModal;