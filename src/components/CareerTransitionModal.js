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
                src="/images/Career transition pay.jpg" 
                alt="Career Transition payment QR code" 
                className="qr-code"
              />
              <p>Scan QR code to subscribe</p>
            </div>
          </div>
          
          <p className="transition-note">
            <strong>Important:</strong> After payment, please email us directly with your name and the service you need at <a href="mailto:3@threehire.com" className="email-link">3@threehire.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CareerTransitionModal;