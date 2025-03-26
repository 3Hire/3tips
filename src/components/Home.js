// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
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