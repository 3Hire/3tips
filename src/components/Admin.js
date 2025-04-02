// src/components/Admin.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listAllEntries, updateUserEntry } from "../api/dynamo";
import "./Admin.css";
import adminBg from "../images/admin.jpg";

function Admin() {
  const [authenticated, setAuthenticated] = useState(() => {
    // Check if user is already authenticated in sessionStorage
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({name: "", email: "", strengths: "", weaknesses: ""});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || "admin";
  
  useEffect(() => {
    // Add body background when component mounts
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(${adminBg})`;
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

  // Load entries if authenticated
  useEffect(() => {
    if (authenticated) {
      fetchEntries();
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (password === adminPassword) {
      setAuthenticated(true);
      // Store authentication state in sessionStorage
      sessionStorage.setItem('adminAuthenticated', 'true');
      fetchEntries();
    } else {
      alert("Incorrect password");
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
  };

  const fetchEntries = async () => {
    try {
      const items = await listAllEntries();
      setEntries(items);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };
  
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name,
      email: entry.email,
      strengths: entry.strengths || "",
      weaknesses: entry.weaknesses || ""
    });
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await updateUserEntry(editingEntry.userId, formData);
      setEditingEntry(null);
      fetchEntries(); // Refresh entries
    } catch (error) {
      console.error("Error updating entry:", error);
      setError("Failed to update entry. " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setEditingEntry(null);
  };

  if (!authenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-form">
          <p className="admin-quote">Admin - you can work anywhere<br></br>but don't forget password😊</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={handleLogin} className="login-button">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <div className="admin-actions">
        <Link to="/add-entry" className="add-button">Add New Entry</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      {editingEntry ? (
        <div className="edit-form">
          <h3>Edit Entry</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Strengths</label>
              <textarea
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                rows="5"
              />
            </div>
            <div className="form-group">
              <label>Weaknesses</label>
              <textarea
                value={formData.weaknesses}
                onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                rows="5"
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Entry"}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <h3>All Entries</h3>
          <div className="table-container">
            <table className="entries-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Strengths</th>
                  <th>Weaknesses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.userId}>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.userId}</td>
                    <td>{entry.code}</td>
                    <td className="multiline-cell">{entry.strengths}</td>
                    <td className="multiline-cell">{entry.weaknesses}</td>
                    <td>
                      <button onClick={() => handleEdit(entry)} className="edit-button">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;
