// src/components/PublicView.js
import React, { useState } from "react";
import { getUserEntry } from "../api/dynamo";

function PublicView() {
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [entry, setEntry] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    try {
      const result = await getUserEntry(userId, code);
      setEntry(result);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>View Your Data</h2>
      <form onSubmit={handleFetch}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">View Entry</button>
      </form>
      {entry && (
        <div>
          <h3>Your Entry</h3>
          <p>Name: {entry.name}</p>
          <p>Email: {entry.email}</p>
          <p>Timestamp: {entry.timestamp}</p>
        </div>
      )}
    </div>
  );
}

export default PublicView;
