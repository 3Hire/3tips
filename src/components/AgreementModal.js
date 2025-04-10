// src/components/AgreementModal.js
import React, { useEffect, useState } from "react";
import "./AgreementModal.css";

function AgreementModal({ onAccept }) {
  const [agreement, setAgreement] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the agreement text from the file
    fetch("/agreement.txt")
      .then(response => response.text())
      .then(text => {
        setAgreement(text);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading agreement:", error);
        setLoading(false);
        setAgreement("Error loading agreement. Please try again later.");
      });
  }, []);

  return (
    <div className="agreement-modal-overlay">
      <div className="agreement-modal">
        <h2>3Hire Candidate Feedback Agreement</h2>
        
        {loading ? (
          <div className="agreement-loading">Loading agreement...</div>
        ) : (
          <div className="agreement-content">
            <pre>{agreement}</pre>
          </div>
        )}
        
        <div className="agreement-actions">
          <button 
            className="agreement-accept-button" 
            onClick={onAccept}
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgreementModal;