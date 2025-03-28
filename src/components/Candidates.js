// src/components/Candidates.js
import React, { useState, useEffect } from "react";
import { getUserEntry } from "../api/dynamo";
import "./Candidates.css";

function Candidates() {
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for saved credentials on first load
  useEffect(() => {
    const savedUserId = localStorage.getItem("candidateUserId");
    const savedCode = localStorage.getItem("candidateCode");
    
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
      localStorage.setItem("candidateUserId", id);
      localStorage.setItem("candidateCode", accessCode);
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
    localStorage.removeItem("candidateUserId");
    localStorage.removeItem("candidateCode");
  };

  return (
    <div className="candidate-container">
      {entry ? (
        <div className="candidate-report">
          <div className="report-header">
            <h2>Your Assessment Report</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
          
          <div className="candidate-info">
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
        <div className="login-container">
          <h2>Input Your Credentials</h2>
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

export default Candidates;
