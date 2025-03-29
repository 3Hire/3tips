import React, { useState, useEffect } from 'react';
import './DeepMatch.css';
import deepmatchBg from '../images/deepmatch.jpg';

const DeepMatch = () => {
  const [id, setId] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle authentication logic
    console.log('Login attempted with:', id, passcode);
    // Future implementation would verify credentials and redirect to DeepMatch session
  };

  useEffect(() => {
    // Add body background when component mounts
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(${deepmatchBg})`;
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
    <div className="deepmatch-container">
      <h1>DeepMatch</h1>
      <p className="deepmatch-tagline">
        A platform for deeper conversations between candidates and hiring managers.
      </p>
      <form className="deepmatch-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="deepmatch-button">
            Start DeepMatch
          </button>
        </form>
    </div>
  );
};

export default DeepMatch;