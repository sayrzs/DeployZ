// Header functionality for DeployZ

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarContainer = document.querySelector('.navbar-container');
    const themeButton = document.getElementById('theme-button');
    
    // Improved header styling on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbarContainer.style.padding = '0.5rem 2rem';
        } else {
            navbar.classList.remove('scrolled');
            navbarContainer.style.padding = '1rem 2rem';
        }
    });
    
    // Add shadow effect on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Add hover effect to theme button
    if (themeButton) {
        themeButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        themeButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
});