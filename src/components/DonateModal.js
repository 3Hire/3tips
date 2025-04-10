// src/components/DonateModal.js
import React from "react";
import "./DonateModal.css";

function DonateModal({ onClose }) {
  return (
    <div className="donate-modal-overlay">
      <div className="donate-modal">
        <div className="donate-modal-header">
          <h2>Support 3Hire</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="donate-content">
          <p>Thank you for considering supporting our work! Your contribution helps us continue providing valuable feedback to job seekers.</p>
          
          <div className="payment-options">
            <div className="payment-option">
              <h3>Venmo</h3>
              <p className="payment-id">Jianhong-Zhou-3</p>
              <div className="qr-container">
                <img 
                  src="/Venmo-J.jpg" 
                  alt="Venmo QR code" 
                  className="qr-code"
                />
                <p>Scan QR with Venmo app</p>
              </div>
            </div>
            
            <div className="payment-option">
              <h3>Zelle</h3>
              <p className="payment-id">626-362-9441</p>
              <div className="qr-container">
                <img 
                  src="/zelle-J.jpg" 
                  alt="Zelle QR code" 
                  className="qr-code"
                />
                <p>Use Zelle in your banking app</p>
              </div>
            </div>
          </div>
          
          <p className="donate-thanks">Your support makes a difference! Thank you for helping us help others.</p>
        </div>
      </div>
    </div>
  );
}

export default DonateModal;