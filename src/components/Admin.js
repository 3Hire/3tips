// src/components/Admin.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listAllEntries } from "../api/dynamo";
import "./Admin.css";

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);

  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || "admin";

  const handleLogin = () => {
    if (password === adminPassword) {
      setAuthenticated(true);
      fetchEntries();
    } else {
      alert("Incorrect password");
    }
  };

  const fetchEntries = async () => {
    try {
      const items = await listAllEntries();
      setEntries(items);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  if (!authenticated) {
    return (
      <div>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {/* Removed inline "Add New Entry" form */}
      <div>
        <Link to="/add-entry">Add New Entry</Link>
      </div>
      <h3>All Entries</h3>
      <div className="table-container">
        <table className="entries-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User ID</th>
              <th>Code</th>
              <th>Strengths</th>
              <th>Weaknesses</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.userId}>
                <td>{entry.name}</td>
                <td>{entry.email}</td>
                <td>{entry.userId}</td>
                <td>{entry.code}</td>
                <td>{entry.strengths}</td>
                <td>{entry.weaknesses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
