// src/components/Contact.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import emailjs from 'emailjs-com';
import "./Contact.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [planTitle, setPlanTitle] = useState("Contact Us");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  // Initialize EmailJS when component mounts
  useEffect(() => {
    emailjs.init("YOUR_USER_ID"); // Replace with your actual EmailJS User ID / Public Key
  }, []);

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
    setIsSubmitting(true);
    setError(null);
    
    // Prepare template parameters for EmailJS
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      subject: planTitle,
      reply_to: email
    };
    
    // Replace these with your actual EmailJS service ID, template ID, and user ID
    // You'll need to sign up at emailjs.com and configure these
    emailjs.send(
      'service_3hire',  // Service ID
      'template_contact',  // Template ID
      templateParams,
      'YOUR_USER_ID'  // User ID / Public Key
    )
    .then((response) => {
      console.log('Email sent successfully!', response);
      setSubmitted(true);
      setIsSubmitting(false);
    })
    .catch((err) => {
      console.error('Failed to send email:', err);
      setError('There was an error sending your message. Please try again or contact us directly.');
      setIsSubmitting(false);
    });
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
          {error && <div className="error-message">{error}</div>}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Contact;