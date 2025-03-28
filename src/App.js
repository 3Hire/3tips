// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Candidates from "./components/Candidates";
import Admin from "./components/Admin";
import Logo from "./components/Logo";
import AddEntry from "./components/AddEntry";
import "./App.css";

function App() {
  return (
    <Router>
      <header>
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="logo">
              <Logo />
            </Link>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/candidates">Candidates</Link></li>
            </ul>
          </div>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/add-entry" element={<AddEntry />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Address</h3>
              <p>3101 N. CENTRAL AVE, STE 183</p>
              <p>PHOENIX, AZ 85012, US</p>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <p>Phone: 480-331-4161</p>
              <p>Email: <a href="mailto:3@threehire.com">3@threehire.com</a></p>
            </div>
            <div className="footer-section">
              <h3>Connect</h3>
              <div className="social-links">
                <a href="https://www.linkedin.com/company/threehire/posts/?feedView=all" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} 3Hire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;