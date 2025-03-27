import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <section className="about-section">
        <div className="about-image">
          <img src="/mission.jpeg" alt="Our Mission" />
        </div>
        <div className="about-text">
          <h2>Our Mission</h2>
          <p>
            We build trusted teams by fostering radical transparency throughout the hiring process, ensuring equitable access and informed decision-making for all candidates, hiring managers, and HR people.
          </p>
        </div>
      </section>
      <section className="about-section">
        <div className="about-image">
          <img src="/vision.jpeg" alt="Our Vision" />
        </div>
        <div className="about-text">
          <h2>Our Vision</h2>
          <p>
            Our vision is to transform interviews into joyful, open spaces for authentic expression, mutual exploration, and continuous evolution.
          </p>
        </div>
      </section>
      <section className="about-section">
        <div className="about-image">
          <img src="/belief.jpeg" alt="Our Value" />
        </div>
        <div className="about-text">
          <h2>Our Value</h2>
          <p>
            We value simplicity in life, seriousness in work, and sincerity in relationship in all our endeavors.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;