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
        The first AI-age recruiting agency, powered by deep matching, expert coaching, and a human touch.
        </p>
        <p className="subtext">
        
        </p>
        <div className="hero-buttons">
          <Link to="/deep-match" className="btn btn-hiring">Start DeepMatch</Link>
          <Link to="/deep-view" className="btn btn-coaching">Start DeepView</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;