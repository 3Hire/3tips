// src/components/Coaching.js
import React, { useState, useEffect } from "react";
import DonateModal from "./DonateModal";
import CoachingModal from "./CoachingModal";
import "./Coaching.css";
import oceanWaves from "../images/ocean-waves.jpg";

function Coaching() {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showCoachingModal, setShowCoachingModal] = useState(false);

  useEffect(() => {
    // Add body background when component mounts
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(${oceanWaves})`;
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

  return (
    <div className="coaching-container">
      {showDonateModal && <DonateModal onClose={handleCloseDonateModal} />}
      {showCoachingModal && <CoachingModal onClose={handleCloseCoachingModal} />}
      
      <h1>Coaching Services</h1>
      <p className="coaching-tagline">Personalized support to help you achieve your career goals</p>
      
      <div className="coaching-plans">
        <div className="plan-cards">
          <div className="plan-card featured">
            <span className="featured-badge">Most Popular</span>
            <h3>Jobseekers Support</h3>
            <p className="plan-price">Donation-Based</p>
            <ul>
              <li>Group support for laid-off workers</li>
              <li>Resources for new graduates</li>
              <li>Job search strategies</li>
              <li>Resume review sessions</li>
              <li>Interview practice</li>
              <li>Peer networking opportunities</li>
              <li>No fees required</li>
            </ul>
            <button onClick={handleOpenDonateModal} className="plan-button">
              Donate to Support
            </button>
          </div>
          
          <div className="plan-card">
            <h3>1-1 Coaching</h3>
            <p className="plan-price">$99/30 minutes</p>
            <ul>
              <li>Personalized 1-on-1 coaching</li>
              <li>Customized to your specific needs</li>
              <li>Career advancement strategies</li>
              <li>Personal development</li>
              <li>Communication improvement</li>
              <li>Leadership development</li>
              <li>Flexible scheduling</li>
            </ul>
            <button onClick={handleOpenCoachingModal} className="plan-button">
              Book a Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coaching;