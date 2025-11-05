// IM tireddddddddddddddddddddd of this so "Scroll-effect functionality for DeployZ"
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements that should "fade in"!
    const fadeElements = document.querySelectorAll('.feature-card, .hero-content, .features-header, .cta-button');
    
    // Options for the observer its not the one in minecraft :)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // craft the observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // observe each element
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth' // i could do that in css but i won't so no one care you won't use my website to create your own website you'll delete all files in the webroot and create your own files so whatever no one cares
                });
            }
        });
    });
});