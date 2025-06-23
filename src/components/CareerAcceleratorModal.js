// src/components/CareerAcceleratorModal.js
import React from "react";
import "./CareerAcceleratorModal.css";

function CareerAcceleratorModal({ onClose }) {
  return (
    <div className="career-accelerator-modal-overlay">
      <div className="career-accelerator-modal">
        <div className="career-accelerator-modal-header">
          <h2>Career Accelerator Program</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="career-accelerator-content">
          <p>Ready to level up? Our 3-month intensive Career Accelerator Program is designed for ambitious mid-career professionals seeking promotion and salary increases.</p>
          
          <div className="payment-option">
            <h3>Program Details</h3>
            <p className="payment-id">$499 upfront + 4% of annual base pay for first year</p>
            <div className="qr-container">
              <img 
                src="/images/Accelerator.jpg" 
                alt="Career Accelerator payment QR code" 
                className="qr-code"
              />
              <p>Scan QR code to get started</p>
            </div>
          </div>
          
          <div className="program-features">
            <h3>What's Included:</h3>
            <ul>
              <li>Leadership skills development</li>
              <li>Performance optimization strategies</li>
              <li>Promotion strategy planning</li>
              <li>Salary negotiation training</li>
              <li>3 months of intensive support</li>
            </ul>
          </div>
          
          <p className="accelerator-note">
            <strong>Important:</strong> After payment, please email us directly with your name and the service you need at <a href="mailto:3@threehire.com" className="email-link">3@threehire.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CareerAcceleratorModal;