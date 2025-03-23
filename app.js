// Simplified app.js for basic interactivity

document.addEventListener('DOMContentLoaded', function() {
    // API base URL configuration
    // Use the production API endpoint
    window.API_BASE_URL = 'https://3hire-api.herokuapp.com/api';
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
});