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
        The first recruiting agency of the AI age, powered by deep matching and deep coaching.
        </p>
        <div className="hero-buttons">
          <Link to="/#" className="btn btn-hiring" onClick={(e) => {
            e.preventDefault();
            document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
          }}>Hiring</Link>
          <Link to="/candidates" className="btn btn-coaching">Coaching</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;