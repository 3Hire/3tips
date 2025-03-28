import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-grid">
        <div className="contact-section">
          <h2>Address</h2>
          <p>3101 N. CENTRAL AVE, STE 183</p>
          <p>PHOENIX, AZ 85012, US</p>
        </div>
        
        <div className="contact-section">
          <h2>Phone</h2>
          <p>480-331-4161</p>
        </div>
        
        <div className="contact-section">
          <h2>Email</h2>
          <p><a href="mailto:3@threehire.ai">3@threehire.ai</a></p>
        </div>
        
        <div className="contact-section">
          <h2>Connect</h2>
          <div className="social-links">
            <a href="https://www.linkedin.com/company/threehire/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;