// src/components/Coaching.js
import React, { useState, useEffect } from "react";
import DonateModal from "./DonateModal";
import CoachingModal from "./CoachingModal";
import CareerTransitionModal from "./CareerTransitionModal";
import "./Coaching.css";

function Coaching() {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showCoachingModal, setShowCoachingModal] = useState(false);
  const [showCareerTransitionModal, setShowCareerTransitionModal] = useState(false);

  useEffect(() => {
    // Add body background when component mounts
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), url(/images/careergym.jpg)`;
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
  
  const handleOpenCareerTransitionModal = () => {
    setShowCareerTransitionModal(true);
  };
  
  const handleCloseCareerTransitionModal = () => {
    setShowCareerTransitionModal(false);
  };

  return (
    <div className="coaching-container">
      {showDonateModal && <DonateModal onClose={handleCloseDonateModal} />}
      {showCoachingModal && <CoachingModal onClose={handleCloseCoachingModal} />}
      {showCareerTransitionModal && <CareerTransitionModal onClose={handleCloseCareerTransitionModal} />}
      
      <h1>CareerGym Services</h1>
      <p className="coaching-tagline">Personalized support to help you achieve your career goals</p>
      
      <div className="coaching-plans">
        <div className="plan-cards">
          <div className="plan-card">
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
          
          <div className="plan-card featured">
            <span className="featured-badge">Most Popular</span>
            <h3>Career Transition</h3>
            <p className="plan-price">$99/month</p>
            <ul>
              <li>Group support for career changers</li>
              <li>Weekly group coaching sessions</li>
              <li>Career transition strategies</li>
              <li>Resume and LinkedIn optimization</li>
              <li>Interview preparation</li>
              <li>Network building techniques</li>
              <li>6-month package</li>
            </ul>
            <button onClick={handleOpenCareerTransitionModal} className="plan-button">
              Join Now
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