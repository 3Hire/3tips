// src/components/DiscoverView.js
import React, { useState, useEffect } from "react";
import { getUserEntry } from "../api/dynamo";
import "./DiscoverView.css";

function DiscoverView() {
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for saved credentials on first load
  useEffect(() => {
    const savedUserId = localStorage.getItem("discoverViewUserId");
    const savedCode = localStorage.getItem("discoverViewCode");
    
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
      localStorage.setItem("discoverViewUserId", id);
      localStorage.setItem("discoverViewCode", accessCode);
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
    localStorage.removeItem("discoverViewUserId");
    localStorage.removeItem("discoverViewCode");
  };

  return (
    <div className="discoverview-container">
      {entry ? (
        <div className="discoverview-report">
          <div className="report-header">
            <h2>Your Assessment Report</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
          
          <div className="discoverview-info">
            <h3>{entry.name}</h3>
            <p className="email">{entry.email}</p>
            <p className="timestamp">Report Date: {new Date(entry.timestamp).toLocaleDateString()}</p>
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
      ) : (
        <div className="login-section">
          <h2>Self-Discovery Portal</h2>
          <div className="discoverview-description">
            <p>
              Every job search, career move, interview, and conversation—whether with a coach, mentor, or hiring manager—is an opportunity for self-discovery. It's a chance to uncover your strengths, recognize areas for growth, and gain clarity on your next steps. Our coaching and feedback system is designed to help you navigate these moments with insight and confidence, guiding you toward the best version of your professional self.
            </p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleFetch}>
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
        </div>
      )}
    </div>
  );
}

export default DiscoverView;