// src/components/Home.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import oceanBg from "../images/ocean.gif";

function Home() {
  useEffect(() => {
    // Add 'home-page' class to body when this component mounts
    document.body.classList.add('home-page');
    
    // Apply background directly to ensure it works
    document.body.style.backgroundImage = `url(${oceanBg})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Remove the class and background when the component unmounts
    return () => {
      document.body.classList.remove('home-page');
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  return (
    <div className="home-hero">
      <div className="hero-content">
        <h1>Accelerate Hiring & Careers</h1>
        <p>
        The first AI-age recruiting agency, powered by deep matching, expert coaching, and a human touch.
        </p>
        <p className="subtext">
        
        </p>
        <div className="hero-buttons">
          <Link to="/deep-match" className="btn btn-hiring">Start HiringBar</Link>
          <Link to="/deep-view" className="btn btn-coaching">Start CareerGym</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;