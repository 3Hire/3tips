// src/components/Contact.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Contact.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [planTitle, setPlanTitle] = useState("Contact Us");
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters from the URL
    const params = new URLSearchParams(location.search);
    const plan = params.get("plan");
    
    // Set a different title based on the plan parameter
    if (plan === "free") {
      setPlanTitle("I'm interested in the Free Plan");
    } else if (plan === "careergym") {
      setPlanTitle("I'm interested in CareerGym");
    } else if (plan === "pro") {
      setPlanTitle("I'm interested in CareerGym Pro");
    }
  }, [location]);

  useEffect(() => {
    // Set a default message based on the plan title
    setMessage(`Hello,\n\n${planTitle}. Please send me more information.\n\nThank you!`);
  }, [planTitle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      setSubmitted(true);
      // In a real app, you would send this data to your backend or an email service
      console.log("Form submitted:", { name, email, message, planTitle });
    }, 1000);
  };

  return (
    <div className="contact-container">
      {submitted ? (
        <div className="success-message">
          <h2>Thank You!</h2>
          <p>Your message has been sent. We'll get back to you soon.</p>
        </div>
      ) : (
        <>
          <h1>{planTitle}</h1>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Contact;