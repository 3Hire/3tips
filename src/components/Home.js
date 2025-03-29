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
          <Link 
            to="/#contact" 
            className="btn btn-hiring" 
            onClick={(e) => {
              e.preventDefault();
              // Scroll to footer section
              document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
              
              // Optional: highlight the contact information in the footer
              const footerContact = document.querySelector('.footer-section:nth-child(2)');
              if (footerContact) {
                footerContact.style.transition = 'background-color 0.5s';
                footerContact.style.backgroundColor = 'rgba(0, 102, 204, 0.2)';
                setTimeout(() => {
                  footerContact.style.backgroundColor = 'transparent';
                }, 1500);
              }
              
              // Copy email template to clipboard
              const emailTemplate = `Subject: Excited About Your Success Stories – Let's Talk!

Hi Team 3Hire,

I just read through your success stories – super exciting stuff!

We are a business in [industry], and we've been facing a few challenges with [briefly describe challenges].

We'd love your help in [specific area], and think we could be a great fit for a partnership.

Let's schedule a time to chat! You can reach me at [phone number] or [email address].

Looking forward to connecting soon!

Best,
[Client's Name]
[Company Name]
[Phone Number]
[Email Address]`;
              
              navigator.clipboard.writeText(emailTemplate).then(() => {
                alert("Email template copied to clipboard! You can paste it into your email to 3@threehire.com");
              }).catch(err => {
                console.error('Could not copy text: ', err);
              });
            }}>
            Find Talent
          </Link>
          <Link to="/candidates" className="btn btn-coaching">Get Coaching</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;