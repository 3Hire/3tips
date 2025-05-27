// src/components/HiringBar.js
import React, { useState, useEffect } from 'react';
import './HiringBar.css';

const HiringBar = () => {
  const [id, setId] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle authentication logic
    console.log('Login attempted with:', id, passcode);
    // Future implementation would verify credentials and redirect to HiringBar session
  };

  useEffect(() => {
    // Add body background when component mounts
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(/images/hiringbar.jpg)`;
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
    <div className="hiringbar-container">
      <h1>HiringBar</h1>
      <p className="hiringbar-tagline">
      Where hiring managers, HR, and candidates have real, relaxed conversations to discover the perfect fit—no pressure, just great matches.
      </p>
      <form className="hiringbar-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">User ID</label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="passcode">Passcode</label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="hiringbar-button">
            Start HiringBar
          </button>
        </form>
    </div>
  );
};

export default HiringBar;