// src/components/Home.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  useEffect(() => {
    // Add 'home-page' class to body when this component mounts
    document.body.classList.add('home-page');
    
    // Remove the class when the component unmounts
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="home-hero">
      <div className="hero-content">
        <h1>Accelerate Hiring & Careers</h1>
        <p>
          AI with heart: our deep matching blends psychology and empathy to speed up your next big step.
        </p>
        <div className="hero-buttons">
          <Link to="/contact" className="btn btn-hiring">Hiring</Link>
          <Link to="/candidates" className="btn btn-coaching">Coaching</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;