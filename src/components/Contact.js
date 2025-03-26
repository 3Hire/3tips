import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-container">
      <h1>Get in Touch</h1>
      <div className="contact-info">
        <div className="contact-item">
          <h2>Phone</h2>
          <p>480-331-4161</p>
        </div>
        <div className="contact-item">
          <h2>Email</h2>
          <p>3@threehire.com</p>
        </div>
        <div className="contact-item">
          <h2>Office Hours</h2>
          <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
          <p>Saturday - Sunday: Closed</p>
        </div>
      </div>
      <div className="contact-social">
        <h2>Connect With Us</h2>
        <div className="social-links">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;