// Simplified app.js for basic interactivity

document.addEventListener('DOMContentLoaded', function() {
    // API base URL configuration
    // Check if we're in a local environment
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:') {
        // Local development
        window.API_BASE_URL = 'http://localhost:3001/api';
    } else {
        // Production - using AWS Amplify
        window.API_BASE_URL = `${window.location.protocol}//${window.location.host}/api`;
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
});