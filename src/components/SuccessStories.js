import React, { useState, useEffect } from "react";
import "./SuccessStories.css";

function SuccessStories() {
  const [activeTab, setActiveTab] = useState('hiring');
  const [activeSlide, setActiveSlide] = useState(0);
  
  const caseStudies = [
    {
      title: "Fastest Hiring: Solving a Startup's Unique Challenge",
      content: `Our client, a growing startup, was facing a critical gap after losing their founding product manager. While many recruiters struggled to identify candidates with the right mix of experience and character to thrive in an early-stage environment, we quickly grasped their unique needs.
      
      Understanding the urgency and the specific qualities required—such as agility, adaptability, and a deep passion for building from the ground up—our team took only 15 days to identify, evaluate, and secure the perfect candidate. This rapid turnaround not only alleviated the startup's pain points but also positioned them for the next phase of growth with a strong, strategic product leader.`,
      metrics: {
        time: "15 days",
        position: "Product Manager",
        industry: "Tech Startup"
      },
      color: "#0066cc" // Blue
    },
    {
      title: "Tough Hiring: Building a High-Caliber Team in a Niche Field",
      content: `Our client, a leader in the cutting-edge fields of chip technology, AI, and operating systems, faced the daunting challenge of assembling a specialized team from a highly exclusive talent pool of fewer than 10 individuals.
      
      Recognizing the uniqueness of their needs, we partnered closely with them to fully understand the technical and cultural fit required. Through dedicated sourcing, in-depth screenings, and seamless collaboration, we successfully helped them secure four top-tier professionals within a year. This accomplishment not only filled critical roles but also helped the client build a high-performance team, positioning them at the forefront of innovation in their field.`,
      metrics: {
        time: "1 year",
        position: "Specialized Tech Team (4 roles)",
        industry: "Advanced Technology"
      },
      color: "#218838" // Green
    },
    {
      title: "Efficiency: Transforming Hiring Processes for Scalable Growth",
      content: `Our client, struggling with an inefficient hiring process, was only able to convert 2-3 candidates from 1,000 resumes, despite working with a talent team and existing agencies.
      
      To address this, we partnered closely with the CEO, CTO, VP, and directors to thoroughly revamp their hiring strategy. By streamlining processes, redefining job requirements, and improving candidate evaluation methods, we enabled them to successfully fill 40 essential roles within one year. 
      
      As a result, their resume-to-hiring conversion rate skyrocketed from less than 1% to an impressive 20%, significantly enhancing their talent acquisition efficiency and setting them up for future success.`,
      metrics: {
        time: "1 year",
        position: "40 roles filled",
        industry: "Enterprise"
      },
      color: "#d92550" // Red
    }
  ];
  
  // Auto-advance slides when in hiring tab
  useEffect(() => {
    let timer;
    if (activeTab === 'hiring') {
      timer = setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % caseStudies.length);
      }, 8000); // Change slide every 8 seconds
    }
    return () => clearTimeout(timer);
  }, [activeSlide, activeTab, caseStudies.length]);
  
  // Go to specific slide
  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="success-stories-container">
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'hiring' ? 'active' : ''}`}
            onClick={() => setActiveTab('hiring')}
          >
            Client Success Stories
          </button>
          <button 
            className={`tab-button ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidate Success Stories
          </button>
        </div>
      </div>
      
      {activeTab === 'hiring' ? (
        <>
          <p className="page-intro">
            At 3Hire, we pride ourselves on delivering exceptional results for our clients. 
            Here are some real-world examples of how our innovative approach to recruitment 
            has made a significant impact on businesses.
          </p>
          
          <div className="success-slider-container">
            {/* Slides */}
            {caseStudies.map((caseStudy, index) => (
              <div 
                key={index} 
                className={`success-slide ${index === activeSlide ? 'active' : ''}`}
                style={{ borderColor: caseStudy.color }}
              >
                <h2 className="case-title" style={{ color: caseStudy.color }}>{caseStudy.title}</h2>
                
                <div className="case-metrics">
                  <div className="metric">
                    <span className="metric-label">Time to Hire:</span>
                    <span className="metric-value">{caseStudy.metrics.time}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Position:</span>
                    <span className="metric-value">{caseStudy.metrics.position}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Industry:</span>
                    <span className="metric-value">{caseStudy.metrics.industry}</span>
                  </div>
                </div>
                
                <div className="case-content">
                  {caseStudy.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Slider Controls */}
            <div className="slider-controls">
              {caseStudies.map((_, index) => (
                <button 
                  key={index} 
                  className={`slider-dot ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to case study ${index + 1}`}
                  style={{ backgroundColor: index === activeSlide ? caseStudies[index].color : 'rgba(0, 0, 0, 0.2)' }}
                />
              ))}
            </div>
            
            {/* Arrow Controls */}
            <button 
              className="slider-arrow prev" 
              onClick={() => setActiveSlide((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)}
              aria-label="Previous case study"
            >
              &#10094;
            </button>
            <button 
              className="slider-arrow next" 
              onClick={() => setActiveSlide((prev) => (prev + 1) % caseStudies.length)}
              aria-label="Next case study"
            >
              &#10095;
            </button>
          </div>
        </>
      ) : (
        <div className="candidate-stories">
          <p className="page-intro">
            We've helped numerous candidates advance their careers through personalized coaching and strategic guidance.
            Our approach focuses on bringing out each individual's unique strengths and positioning them for success.
          </p>
          
          <div className="linkedin-recommendations">
            <div className="recommendation-intro">
              <h2>Authentic Testimonials</h2>
              <p>
                Read what candidates have to say about their experience working with us. 
                We're proud of the positive impact we've had on professionals across various industries and career stages.
              </p>
            </div>
            
            <div className="linkedin-card">
              <div className="linkedin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2" width="48px" height="48px">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </div>
              
              <div className="linkedin-content">
                <h3>View Client Recommendations</h3>
                <p>
                  Visit our founder's LinkedIn profile to read detailed recommendations and testimonials 
                  from candidates who have experienced our coaching and career advancement services.
                </p>
                <a 
                  href="https://www.linkedin.com/in/zhoujianhong/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="linkedin-link"
                >
                  View LinkedIn Recommendations →
                </a>
              </div>
            </div>
            
            <div className="highlight-quote">
              <blockquote>
                "Working with 3Hire transformed my career trajectory. Their personalized coaching and strategic guidance 
                helped me land a role that perfectly matches my skills and aspirations."
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuccessStories;