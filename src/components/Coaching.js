// src/components/Coaching.js
import React, { useState, useEffect } from "react";
import CoachingModal from "./CoachingModal";
import CareerAcceleratorModal from "./CareerAcceleratorModal";
import IndustryPivotModal from "./IndustryPivotModal";
import "./Coaching.css";

function Coaching() {
  const [showCoachingModal, setShowCoachingModal] = useState(false);
  const [showCareerAcceleratorModal, setShowCareerAcceleratorModal] = useState(false);
  const [showIndustryPivotModal, setShowIndustryPivotModal] = useState(false);

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

  const handleOpenCoachingModal = () => {
    setShowCoachingModal(true);
  };
  
  const handleCloseCoachingModal = () => {
    setShowCoachingModal(false);
  };
  
  const handleOpenCareerAcceleratorModal = () => {
    setShowCareerAcceleratorModal(true);
  };
  
  const handleCloseCareerAcceleratorModal = () => {
    setShowCareerAcceleratorModal(false);
  };
  
  const handleOpenIndustryPivotModal = () => {
    setShowIndustryPivotModal(true);
  };
  
  const handleCloseIndustryPivotModal = () => {
    setShowIndustryPivotModal(false);
  };

  return (
    <div className="coaching-container">
      {showCoachingModal && <CoachingModal onClose={handleCloseCoachingModal} />}
      {showCareerAcceleratorModal && <CareerAcceleratorModal onClose={handleCloseCareerAcceleratorModal} />}
      {showIndustryPivotModal && <IndustryPivotModal onClose={handleCloseIndustryPivotModal} />}
      
      <h1>CareerGym Coaching Services</h1>
      <p className="coaching-tagline">Personalized support to help you achieve your career goals</p>
      
      <div className="coaching-plans">
        <div className="plan-cards">
          <div className="plan-card">
            <h3>Career Accelerator</h3>
            <p className="plan-price">$499 upfront + 4% annual pay</p>
            <ul>
              <li>For ambitious professionals ready to level up</li>
              <li>3 months intensive support</li>
              <li>Leadership skills development</li>
              <li>Performance optimization</li>
              <li>Promotion strategy</li>
              <li>Salary negotiation</li>
              <li>Target: Mid-career professionals</li>
            </ul>
            <button onClick={handleOpenCareerAcceleratorModal} className="plan-button">
              Get Started
            </button>
          </div>
          
          <div className="plan-card featured">
            <span className="featured-badge">Most Popular</span>
            <h3>Industry Pivot Pro</h3>
            <p className="plan-price">$1999 upfront + 3% annual pay</p>
            <ul>
              <li>For professionals changing industries</li>
              <li>6 months comprehensive transformation</li>
              <li>Skills translation & industry research</li>
              <li>Network building & personal branding</li>
              <li>Target: Career path switchers</li>
              <li>Extension: $299/month after 6 months</li>
            </ul>
            <button onClick={handleOpenIndustryPivotModal} className="plan-button">
              Start Your Pivot
            </button>
          </div>
          
          <div className="plan-card">
            <h3>1-1 Coaching</h3>
            <p className="plan-price">Personalized guidance</p>
            <ul>
              <li>For new grads & career explorers</li>
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