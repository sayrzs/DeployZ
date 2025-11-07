// Sticky Resizable Header Functionality for DeployZ

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarContainer = document.querySelector('.navbar-container');
    const logo = document.querySelector('.logo');
    const logoImg = logo ? logo.querySelector('img') : null;
    const logoText = logo ? logo.querySelector('span, h1') : null;
    const themeButton = document.querySelector('.theme-button');

    let lastScrollTop = 0;
    let ticking = false;

    // Main scroll handler with performance optimization
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateNavbar(scrollTop);
                ticking = false;
            });
            ticking = true;
        }

        lastScrollTop = scrollTop;
    }

    // Update navbar styling based on scroll position
    function updateNavbar(scrollTop) {
        if (scrollTop > 50) {
            // Add scrolled class for resizing
            navbar.classList.add('scrolled');
            navbarContainer.style.padding = '0.75rem 2rem';

            // Resize logo image
            if (logoImg) {
                logoImg.style.width = '35px';
                logoImg.style.height = '35px';
            }

            // Resize logo text
            if (logoText) {
                logoText.style.fontSize = '1.3rem';
            }

            // Resize theme button
            if (themeButton) {
                themeButton.style.padding = '8px 16px';
                themeButton.style.fontSize = '0.9rem';
            }

        } else {
            // Remove scrolled class for original size
            navbar.classList.remove('scrolled');
            navbarContainer.style.padding = '1.5rem 2rem';

            // Reset logo image size
            if (logoImg) {
                logoImg.style.width = '45px';
                logoImg.style.height = '45px';
            }

            // Reset logo text size
            if (logoText) {
                logoText.style.fontSize = '1.5rem';
            }

            // Reset theme button size
            if (themeButton) {
                themeButton.style.padding = '10px 20px';
                themeButton.style.fontSize = '1rem';
            }
        }

        // Add shadow and backdrop effects on scroll
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.webkitBackdropFilter = 'blur(10px)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.backdropFilter = 'none';
            navbar.style.webkitBackdropFilter = 'none';
        }
    }

    // Attach scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add hover effects for theme button
    if (themeButton) {
        themeButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        themeButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Initial call to set proper state
    updateNavbar(window.pageYOffset || document.documentElement.scrollTop);
});