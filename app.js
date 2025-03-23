// Simplified app.js for basic interactivity

document.addEventListener('DOMContentLoaded', function() {
    // API base URL for development
    // Check if we're running in a file:// protocol (local file)
    if (window.location.protocol === 'file:') {
        window.API_BASE_URL = 'http://localhost:3001/api';
    } else {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = (hostname === 'localhost' || hostname === '127.0.0.1') ? ':3001' : '';
        window.API_BASE_URL = `${protocol}//${hostname}${port}/api`;
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