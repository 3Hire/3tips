// src/components/IndustryPivotModal.js
import React from "react";
import "./IndustryPivotModal.css";

function IndustryPivotModal({ onClose }) {
  return (
    <div className="industry-pivot-modal-overlay">
      <div className="industry-pivot-modal">
        <div className="industry-pivot-modal-header">
          <h2>Industry Pivot Pro Program</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="industry-pivot-content">
          <p>Transform your career with our comprehensive 6-month Industry Pivot Pro Program. Perfect for experienced professionals switching industries or career functions.</p>
          
          <div className="payment-option">
            <h3>Program Details</h3>
            <p className="payment-id">$1999 upfront + 3% of new job's annual base pay</p>
            <div className="qr-container">
              <img 
                src="/images/Pivot Pro.jpg" 
                alt="Industry Pivot Pro payment QR code" 
                className="qr-code"
              />
              <p>Scan QR code to start your pivot</p>
            </div>
          </div>
          
          <div className="program-features">
            <h3>What's Included:</h3>
            <ul>
              <li>Skills translation & mapping</li>
              <li>Industry research & analysis</li>
              <li>Network building strategies</li>
              <li>Personal branding development</li>
              <li>6 months comprehensive transformation</li>
              <li>Extension available: $299/month after 6 months</li>
            </ul>
          </div>
          
          <p className="pivot-note">
            <strong>Important:</strong> After payment, please email us directly with your name and the service you need at <a href="mailto:3@threehire.com" className="email-link">3@threehire.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default IndustryPivotModal;