// Scroll effects functionality for DeployZ

// Fade-in animation when scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Get all elements that should fade in
    const fadeElements = document.querySelectorAll('.feature-card, .hero-content, .features-header, .cta-button');
    
    // Options for the observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for better visual effect
                const delay = index * 100;
                
                setTimeout(() => {
                    // Determine animation type based on element position
                    let animationClass = 'fadeInUp';
                    const rect = entry.target.getBoundingClientRect();
                    
                    if (rect.left < window.innerWidth / 2) {
                        animationClass = 'fadeInLeft';
                    } else if (rect.right > window.innerWidth / 2) {
                        animationClass = 'fadeInRight';
                    }
                    
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0)';
                    entry.target.classList.add(animationClass);
                    observer.unobserve(entry.target);
                }, delay);
            }
        });
    }, observerOptions);
    
    // Observe each element
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Start observing after a short delay to allow page to settle
    setTimeout(() => {
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }, 100);
});

// Smooth scrolling functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add skeleton loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Skip images that already have a src
        if (img.src && img.complete) return;
        
        // Create skeleton loader
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-avatar';
        skeleton.style.width = img.width + 'px';
        skeleton.style.height = img.height + 'px';
        skeleton.style.borderRadius = '50%';
        
        // Insert skeleton before image
        img.parentNode.insertBefore(skeleton, img);
        img.style.display = 'none';
        
        // When image loads, remove skeleton
        img.addEventListener('load', function() {
            skeleton.remove();
            img.style.display = 'block';
        });
    });
});