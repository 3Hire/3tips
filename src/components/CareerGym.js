// src/components/CareerGym.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserEntry, updateAgreementStatus } from "../api/dynamo";
import AgreementModal from "./AgreementModal";
import DonateModal from "./DonateModal";
import CoachingModal from "./CoachingModal";
import RequestFeedbackModal from "./RequestFeedbackModal";
import "./CareerGym.css";
import careergymBg from "../images/careergym.jpg";

function CareerGym() {
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showCoachingModal, setShowCoachingModal] = useState(false);
  const [showRequestFeedbackModal, setShowRequestFeedbackModal] = useState(false);
  const location = useLocation();

  // No need to check localStorage anymore, we're using the database field

  // Check for URL parameters, then saved credentials on first load
  useEffect(() => {
    // Parse query parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    const urlId = searchParams.get("id");
    const urlCode = searchParams.get("code");
    const action = searchParams.get("action");
    
    // Check if action parameter exists to open a specific modal
    if (action) {
      if (action === "donate") {
        setShowDonateModal(true);
      } else if (action === "book") {
        setShowCoachingModal(true);
      }
    }
    
    // If URL has parameters, use them
    if (urlId && urlCode) {
      setUserId(urlId);
      setCode(urlCode);
      fetchEntry(urlId, urlCode);
    } else {
      // Otherwise check for saved credentials
      const savedUserId = localStorage.getItem("feedbackUserId");
      const savedCode = localStorage.getItem("feedbackCode");
      
      if (savedUserId && savedCode) {
        setUserId(savedUserId);
        setCode(savedCode);
        fetchEntry(savedUserId, savedCode);
      }
    }
  }, [location.search]);

  const fetchEntry = async (id, accessCode) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUserEntry(id, accessCode);
      
      // Save successful credentials to localStorage
      localStorage.setItem("feedbackUserId", id);
      localStorage.setItem("feedbackCode", accessCode);
      
      // Check if agreement has been signed in the database
      if (result.agreementSigned) {
        // If agreement already accepted, show the feedback
        setEntry(result);
      } else {
        // Store the entry but don't display it until agreement is accepted
        setEntry(result);
        setShowAgreement(true);
      }
    } catch (error) {
      console.error("Error fetching entry:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptAgreement = async () => {
    if (entry && entry.userId) {
      try {
        // Update the agreement status in the database
        await updateAgreementStatus(entry.userId, true);
        
        // Update local state
        setEntry({
          ...entry,
          agreementSigned: true
        });
        
        setAgreementAccepted(true);
        setShowAgreement(false);
      } catch (error) {
        console.error("Error updating agreement status:", error);
        // If DB update fails, still allow viewing the feedback this session
        setShowAgreement(false);
      }
    } else {
      // Fallback if somehow entry is not available
      setShowAgreement(false);
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    fetchEntry(userId, code);
  };
  
  const handleLogout = () => {
    setEntry(null);
    setUserId("");
    setCode("");
    localStorage.removeItem("feedbackUserId");
    localStorage.removeItem("feedbackCode");
  };

  useEffect(() => {
    // Add body background when component mounts
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(${careergymBg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Reset background when component unmounts
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  const handleOpenDonateModal = () => {
    setShowDonateModal(true);
  };

  const handleCloseDonateModal = () => {
    setShowDonateModal(false);
  };
  
  const handleOpenCoachingModal = () => {
    setShowCoachingModal(true);
  };
  
  const handleCloseCoachingModal = () => {
    setShowCoachingModal(false);
  };
  
  const handleOpenRequestFeedbackModal = () => {
    setShowRequestFeedbackModal(true);
  };
  
  const handleCloseRequestFeedbackModal = () => {
    setShowRequestFeedbackModal(false);
  };
  
  return (
    <div className="careergym-container">
      {showAgreement && <AgreementModal onAccept={handleAcceptAgreement} />}
      {showDonateModal && <DonateModal onClose={handleCloseDonateModal} />}
      {showCoachingModal && <CoachingModal onClose={handleCloseCoachingModal} />}
      {showRequestFeedbackModal && <RequestFeedbackModal isOpen={showRequestFeedbackModal} onClose={handleCloseRequestFeedbackModal} />}
      
      {entry ? (
        <>
          <h1>Your Interview Feedback</h1>
          <div className="report-content">
            <div className="report-header">
              <div>
                <h3>{entry.name}</h3>
                <p className="email">{entry.email}</p>
                <p className="timestamp">Feedback Date: {new Date(entry.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(150, 150, 150, 0.5)',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                fontWeight: 600,
                cursor: 'pointer',
                maxWidth: '100px',
                fontSize: '0.85rem'
              }}
            >
              Logout
            </button>
            
            <div className="assessment-section">
              <h4>Interview Strengths</h4>
              <div className="assessment-content">{entry.strengths}</div>
            </div>
            
            <div className="assessment-section">
              <h4>Growth Opportunities</h4>
              <div className="assessment-content">{entry.weaknesses}</div>
            </div>
            
            <div className="feedback-actions">
              <button 
                onClick={() => window.open('https://www.linkedin.com/in/zhoujianhong/', '_blank', 'noopener,noreferrer')} 
                className="action-button recommend-button"
                style={{
                  backgroundColor: '#0077B5',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                  maxWidth: '100px',
                  fontSize: '0.85rem'
                }}
              >
                Recommend
              </button>
              <button 
                onClick={handleOpenDonateModal} 
                className="action-button donate-button"
                style={{
                  backgroundColor: '#6772E5',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                  maxWidth: '100px',
                  fontSize: '0.85rem'
                }}
              >
                Donate
              </button>
              <button 
                onClick={handleOpenCoachingModal} 
                className="action-button book-button"
                style={{
                  backgroundColor: '#00A2FF',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                  maxWidth: '100px',
                  fontSize: '0.85rem'
                }}
              >
                Book
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>Interview Feedback Access</h1>
          
          {error && <div className="error-message">{error}</div>}
          <form className="careergym-form" onSubmit={handleFetch}>
            <div className="form-group">
              <label>User ID</label>
              <input
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Access Code</label>
              <input
                type="text"
                placeholder="Enter your access code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "View My Feedback"}
            </button>
          </form>
          
          <div className="feedback-request-container">
            <p className="no-code">Don't have an access code?</p>
            <button 
              onClick={handleOpenRequestFeedbackModal} 
              className="request-feedback-button"
              style={{
                backgroundColor: '#e53935',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '30px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                margin: '10px auto',
                display: 'block',
                width: 'auto'
              }}
            >
              Ask for Feedback
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CareerGym;