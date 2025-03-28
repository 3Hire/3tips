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
          <p><a href="mailto:3@threehire.ai">3@threehire.ai</a></p>
        </div>
      </div>
      <div className="contact-social">
        <div className="social-links">
          <a href="https://www.linkedin.com/company/threehire/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;