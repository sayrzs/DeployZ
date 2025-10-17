// Theme switcher functionality for DeployZ
const themeButton = document.getElementById("theme-button");
const themeDropdown = document.getElementById("theme-dropdown");
const themePages = document.querySelectorAll(".theme-page");
const themeOptions = document.querySelectorAll(".theme-option");
const themeDots = document.querySelectorAll(".theme-dot");
const prevArrow = document.getElementById("prev-arrow");
const nextArrow = document.getElementById("next-arrow");
const body = document.body;
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

let currentPage = 0;
const totalPages = themePages.length;

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function showPage(page) {
    currentPage = page;
    
    // Hide all pages
    themePages.forEach(p => {
        p.classList.remove("active");
    });
    
    // Show current page
    themePages[page].classList.add("active");
    
    // Update dots
    themeDots.forEach((dot, index) => {
        if (index === page) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });

    // Update arrows
    prevArrow.disabled = page === 0;
    nextArrow.disabled = page === totalPages - 1;
}

function nextPage() {
    if (currentPage < totalPages - 1) {
        showPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 0) {
        showPage(currentPage - 1);
    }
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const themeGridContainer = document.querySelector(".theme-grid-container");

themeGridContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

themeGridContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next page
            nextPage();
        } else {
            // Swipe right - previous page
            prevPage();
        }
    }
}

themeButton.addEventListener("click", function(event) {
    event.stopPropagation();
    themeDropdown.classList.toggle("active");
});

document.addEventListener("click", function(event) {
    if (!themeButton.contains(event.target) && !themeDropdown.contains(event.target)) {
        themeDropdown.classList.remove("active");
    }
});

themeOptions.forEach(option => {
    option.addEventListener("click", function() {
        const theme = this.getAttribute("data-theme");
        const themeName = this.getAttribute("data-name");
        
        body.setAttribute("data-theme", theme);
        
        themeOptions.forEach(opt => opt.classList.remove("active"));
        this.classList.add("active");
        
        themeDropdown.classList.remove("active");
        
        localStorage.setItem("deployz-theme", theme);
        
        showToast(`Theme changed to ${themeName}`);
    });
});

themeDots.forEach(dot => {
    dot.addEventListener("click", function() {
        const page = parseInt(this.getAttribute("data-page"));
        showPage(page);
    });
});

prevArrow.addEventListener("click", prevPage);
nextArrow.addEventListener("click", nextPage);

// Keyboard navigation
document.addEventListener("keydown", function(e) {
    if (themeDropdown.classList.contains("active")) {
        if (e.key === "ArrowLeft") {
            prevPage();
        } else if (e.key === "ArrowRight") {
            nextPage();
        }
    }
});

const savedTheme = localStorage.getItem("deployz-theme");
if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
    themeOptions.forEach(option => {
        if (option.getAttribute("data-theme") === savedTheme) {
            option.classList.add("active");
            // Find which page this theme is on
            const parentPage = option.closest('.theme-page');
            if (parentPage) {
                const pageIndex = parseInt(parentPage.id.replace('page-', ''));
                showPage(pageIndex);
            }
        } else {
            option.classList.remove("active");
        }
    });
}

window.addEventListener("scroll", function() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = "var(--surface-color)";
    } else {
        navbar.style.backgroundColor = "var(--navbar-bg)";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const yearSpan = document.getElementById("copyright-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});