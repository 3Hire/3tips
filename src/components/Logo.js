// src/components/Logo.js
import React from "react";

const Logo = () => (
  <img 
    src="/images/3Hire - Logo.jpg" 
    alt="3Hire Logo" 
    style={{ 
      height: "40px", 
      width: "40px",
      borderRadius: "50%",
      objectFit: "cover"
    }} 
  />
);

export default Logo;
