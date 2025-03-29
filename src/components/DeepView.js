// src/components/DeepView.js
import React, { useState, useEffect } from "react";
import { getUserEntry } from "../api/dynamo";
import "./DeepView.css";
import deepviewBg from "../images/deepview.jpg";

function DeepView() {
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for saved credentials on first load
  useEffect(() => {
    const savedUserId = localStorage.getItem("deepViewUserId");
    const savedCode = localStorage.getItem("deepViewCode");
    
    if (savedUserId && savedCode) {
      setUserId(savedUserId);
      setCode(savedCode);
      fetchEntry(savedUserId, savedCode);
    }
  }, []);

  const fetchEntry = async (id, accessCode) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUserEntry(id, accessCode);
      setEntry(result);
      // Save successful credentials to localStorage
      localStorage.setItem("deepViewUserId", id);
      localStorage.setItem("deepViewCode", accessCode);
    } catch (error) {
      console.error("Error fetching entry:", error);
      setError(error.message);
    } finally {
      setLoading(false);
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
    localStorage.removeItem("deepViewUserId");
    localStorage.removeItem("deepViewCode");
  };

  useEffect(() => {
    // Add body background when component mounts
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(${deepviewBg})`;
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

  return (
    <div className="deepview-container">
      {entry ? (
        <>
          <h1>Your Assessment Report</h1>
          <div className="report-content">
            <div className="report-header">
              <div>
                <h3>{entry.name}</h3>
                <p className="email">{entry.email}</p>
                <p className="timestamp">Report Date: {new Date(entry.timestamp).toLocaleDateString()}</p>
              </div>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            
            <div className="assessment-section">
              <h4>Strengths</h4>
              <div className="assessment-content">{entry.strengths}</div>
            </div>
            
            <div className="assessment-section">
              <h4>Areas for Improvement</h4>
              <div className="assessment-content">{entry.weaknesses}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>DeepView</h1>
          <p className="deepview-tagline">
            A self-discovery portal that helps candidates understand their strengths and growth areas.
          </p>
          
          {error && <div className="error-message">{error}</div>}
          <form className="deepview-form" onSubmit={handleFetch}>
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
              {loading ? "Loading..." : "Access My Report"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default DeepView;