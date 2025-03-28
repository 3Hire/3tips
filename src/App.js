// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
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
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/candidates">Candidates</Link></li>
            </ul>
          </div>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/add-entry" element={<AddEntry />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} 3Hire. All rights reserved.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;