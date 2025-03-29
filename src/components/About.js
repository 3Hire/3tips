import React, { useState, useEffect } from "react";
import "./About.css";

function About() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      image: "/mission.jpeg",
      title: "Our Mission",
      text: "We build trusted teams by fostering radical transparency throughout the hiring process, ensuring equitable access and informed decision-making for all candidates, hiring managers, and HR people."
    },
    {
      image: "/vision.jpeg",
      title: "Our Vision",
      text: "Our vision is to transform interviews into joyful, open spaces for authentic expression, mutual exploration, and continuous evolution."
    },
    {
      image: "/belief.jpeg",
      title: "Our Value",
      text: "We value simplicity in life, seriousness in work, and sincerity in relationship in all our endeavors."
    },
    {
      image: "/images/team.jpg",
      title: "The Team",
      text: "We are engineers, psychologists, and top recruiters innovating career growth and hiring for the AI age."
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeSlide, slides.length]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="about-container">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
            </div>
          </div>
        ))}
        
        <div className="slider-controls">
          {slides.map((_, index) => (
            <button 
              key={index} 
              className={`slider-dot ${index === activeSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          className="slider-arrow prev" 
          onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          aria-label="Previous slide"
        >
          &#10094;
        </button>
        <button 
          className="slider-arrow next" 
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          aria-label="Next slide"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default About;