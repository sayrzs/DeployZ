// Theme switcher functionality for DeployZ
const themeButton = document.getElementById("theme-button");
const themeDropdown = document.getElementById("theme-dropdown");
const themeGridContainer = document.getElementById("theme-grid-container");
const themePagination = document.getElementById("theme-pagination");
const prevArrow = document.getElementById("prev-arrow");
const nextArrow = document.getElementById("next-arrow");
const body = document.body;
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

let currentPage = 0;
let totalPages = 0;
let themes = [];
const themesPerPage = 8;

// Extract themes from CSS instead of JSON
async function loadThemesFromCSS() {
    try {
        // Fetch the CSS file
        const response = await fetch('assets/css/themes.css');
        const cssText = await response.text();
        
        // Parse CSS to extract theme data
        const themeData = parseCSSThemes(cssText);
        themes = themeData;
        totalPages = Math.ceil(themes.length / themesPerPage);
        renderThemes();
        setupPagination();
        restoreSavedTheme();
    } catch (error) {
        console.error('Failed to load themes from CSS:', error);
    }
}

// Parse CSS to extract theme information
function parseCSSThemes(cssText) {
    // Regular expression to match theme blocks
    const themeRegex = /\[data-theme="([^"]+)"\]\s*{([^}]*)}/g;
    const themes = [];
    let match;
    
    // Define which themes should be marked as "new"
    const newThemes = ['aurora', 'midnight-green', 'sunset-orange', 'electric-blue'];
    
    // Extract all theme definitions
    while ((match = themeRegex.exec(cssText)) !== null) {
        const themeId = match[1];
        const themeContent = match[2];
        
        // Extract theme name from comments (first line after /* */
        const nameMatch = themeContent.match(/\/\*\s*([^-][^-]*?)\s*-/);
        let themeName = themeId.charAt(0).toUpperCase() + themeId.slice(1);
        
        if (nameMatch) {
            themeName = nameMatch[1].trim();
        }
        
        // Create a simple icon mapping based on theme name
        const icon = getIconForTheme(themeName, themeId);
        
        // Extract some colors for display (this is just for visual representation)
        const colors = extractColorsFromTheme(themeContent);
        
        // Check if this theme should be marked as new
        const isNew = newThemes.includes(themeId);
        
        themes.push({
            id: themeId,
            name: themeName,
            icon: icon,
            colors: colors,
            new: isNew
        });
    }
    
    return themes;
}

// Simple icon mapping based on theme names
function getIconForTheme(themeName, themeId) {
    const name = themeName.toLowerCase();
    const id = themeId.toLowerCase();
    
    // Icon mapping based on theme characteristics
    if (name.includes('github')) return 'fab fa-github';
    if (name.includes('matrix')) return 'fas fa-code';
    if (name.includes('dracula')) return 'fas fa-moon';
    if (name.includes('nord')) return 'fas fa-snowflake';
    if (name.includes('discord')) return 'fab fa-discord';
    if (name.includes('monokai')) return 'fas fa-fire';
    if (name.includes('atom') || name.includes('one dark')) return 'fas fa-atom';
    if (name.includes('material')) return 'fas fa-mobile-alt';
    if (name.includes('solarized')) return 'fas fa-sun';
    if (name.includes('gruvbox')) return 'fas fa-box';
    if (name.includes('cyberpunk')) return 'fas fa-robot';
    if (name.includes('rose') && name.includes('pine')) return 'fas fa-leaf';
    if (name.includes('night') && name.includes('owl')) return 'img/owl';
    if (name.includes('synthwave')) return 'fas fa-music';
    if (name.includes('ayu')) return 'fas fa-adjust';
    if (name.includes('catppuccin')) return 'fas fa-coffee';
    if (name.includes('gotham')) return 'fas fa-city';
    if (name.includes('pro')) return 'fas fa-briefcase';
    if (name.includes('plus') || name.includes('dark+')) return 'fas fa-plus';
    if (name.includes('neon')) return 'fas fa-bolt';
    if (name.includes('glass')) return 'fas fa-window-maximize';
    if (name.includes('minimal')) return 'fas fa-minus';
    if (name.includes('sunset')) return 'fas fa-cloud-sun';
    if (name.includes('ocean') || name.includes('water')) return 'fas fa-water';
    if (name.includes('forest') || name.includes('tree')) return 'fas fa-tree';
    if (name.includes('midnight')) return 'fas fa-moon';
    if (name.includes('purple') || name.includes('deep')) return 'fas fa-crown';
    if (name.includes('crimson') || name.includes('heart')) return 'fas fa-heart';
    if (name.includes('tropical') || name.includes('beach')) return 'fas fa-umbrella-beach';
    if (name.includes('lavender') || name.includes('wind')) return 'fas fa-wind';
    if (name.includes('ruby') || name.includes('gem')) return 'fas fa-gem';
    if (name.includes('emerald')) return 'fas fa-gem';
    if (name.includes('sapphire')) return 'fas fa-gem';
    if (name.includes('amber')) return 'fas fa-fire';
    if (name.includes('coral') || name.includes('fish')) return 'fas fa-fish';
    if (name.includes('mint') || name.includes('leaf')) return 'fas fa-leaf';
    if (name.includes('slate')) return 'fas fa-mountain';
    if (name.includes('indigo') || name.includes('star')) return 'fas fa-star';
    if (name.includes('reef') || name.includes('fish')) return 'fas fa-fish';
    if (name.includes('aurora') || name.includes('snowflake')) return 'fas fa-snowflake';
    if (name.includes('green') && name.includes('midnight')) return 'fas fa-moon';
    if (name.includes('orange') && name.includes('sunset')) return 'fas fa-cloud-sun';
    if (name.includes('blue') && name.includes('electric')) return 'fas fa-bolt';
    
    // Default icon
    return 'fas fa-palette';
}

// Extract sample colors from theme content for display
function extractColorsFromTheme(themeContent) {
    // Extract background, surface, and accent colors
    const bgColorMatch = themeContent.match(/--bg-color:\s*([^;]+)/);
    const surfaceColorMatch = themeContent.match(/--surface-color:\s*([^;]+)/);
    const accentColorMatch = themeContent.match(/--accent-color:\s*([^;]+)/);
    
    // Return the found colors or default ones
    return [
        bgColorMatch ? bgColorMatch[1].trim() : '#0d1117',
        surfaceColorMatch ? surfaceColorMatch[1].trim() : '#161b22',
        accentColorMatch ? accentColorMatch[1].trim() : '#58a6ff'
    ];
}

// Apply theme colors as CSS variables
function applyThemeColors(theme) {
    // Check if this theme has a CSS definition by checking if there's a rule for [data-theme="theme-id"]
    const hasCssDefinition = document.querySelector(`[data-theme="${theme.id}"]`) !== null;
    
    // Only apply dynamic colors for themes that don't have CSS definitions
    if (hasCssDefinition) {
        // For themes with CSS definitions, we don't need to apply dynamic colors
        // The CSS will handle all the styling
        return;
    }
    
    // For themes without CSS definitions, apply dynamic colors
    const root = document.documentElement;
    
    // Convert hex colors to RGB for alpha variants
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // Get primary, secondary, and accent colors
    const primaryColor = theme.colors[0];
    const secondaryColor = theme.colors[1];
    const accentColor = theme.colors[2];
    
    // Convert to RGB
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);
    const accentRgb = hexToRgb(accentColor);
    
    // Calculate derived colors (darkened/lightened versions)
    function adjustBrightness(hex, percent) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        
        let r = Math.min(255, Math.max(0, rgb.r + percent * 2.55));
        let g = Math.min(255, Math.max(0, rgb.g + percent * 2.55));
        let b = Math.min(255, Math.max(0, rgb.b + percent * 2.55));
        
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }
    
    // Set CSS variables
    root.style.setProperty('--bg-color', primaryColor);
    root.style.setProperty('--surface-color', secondaryColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--accent-color-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
    root.style.setProperty('--accent-color-alpha', `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.15)`);
    root.style.setProperty('--border-color', adjustBrightness(secondaryColor, -10));
    root.style.setProperty('--border-secondary', secondaryColor);
    root.style.setProperty('--bg-secondary', adjustBrightness(primaryColor, -20));
    root.style.setProperty('--code-bg', primaryColor);
    root.style.setProperty('--gradient-start', primaryColor);
    root.style.setProperty('--gradient-end', secondaryColor);
    root.style.setProperty('--shadow-color', `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.25)`);
    root.style.setProperty('--card-bg', secondaryColor);
    root.style.setProperty('--navbar-bg', `${primaryColor}E6`); // 90% opacity
    root.style.setProperty('--scrollbar-bg', primaryColor);
    root.style.setProperty('--scrollbar-thumb', accentColor);
    root.style.setProperty('--scrollbar-thumb-hover', adjustBrightness(accentColor, 10));
    root.style.setProperty('--success-color', '#4ade80');
    root.style.setProperty('--warning-color', '#fbbf24');
    root.style.setProperty('--error-color', '#f87171');
    root.style.setProperty('--info-color', '#60a5fa');
}

function renderThemes() {
    // Clear existing content
    themeGridContainer.innerHTML = '';
    
    // Create pages
    for (let i = 0; i < totalPages; i++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'theme-page';
        pageDiv.id = `page-${i}`;
        if (i === 0) pageDiv.classList.add('active');
        
        // Add themes to this page
        const startIndex = i * themesPerPage;
        const endIndex = Math.min(startIndex + themesPerPage, themes.length);
        
        for (let j = startIndex; j < endIndex; j++) {
            const theme = themes[j];
            const themeOption = createThemeElement(theme, j === startIndex && i === 0);
            pageDiv.appendChild(themeOption);
        }
        
        themeGridContainer.appendChild(pageDiv);
    }
    
    // Update the global theme elements after rendering
    updateThemeElements();
}

function createThemeElement(theme, isActive) {
    const themeOption = document.createElement('div');
    themeOption.className = 'theme-option';
    if (isActive) themeOption.classList.add('active');
    themeOption.setAttribute('data-theme', theme.id);
    themeOption.setAttribute('data-name', theme.name);

    // Add "new" badge if theme is new
    if (theme.new) {
        themeOption.classList.add('new-theme');
    }

    // Handle special case for Night Owl image
    if (theme.icon === 'img/owl') {
        const img = document.createElement('img');
        img.src = 'https://cdn-icons-png.flaticon.com/512/8531/8531909.png';
        img.width = 30;
        img.alt = 'owl';
        img.style.filter = 'brightness(0) invert(1) contrast(100%)';
        themeOption.appendChild(img);
    } else {
        const icon = document.createElement('i');
        icon.className = theme.icon;
        themeOption.appendChild(icon);
    }

    // Create color swatches
    const colorContainer = document.createElement('div');
    colorContainer.className = 'theme-colors';

    theme.colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'theme-color';
        colorDiv.style.background = color;
        colorContainer.appendChild(colorDiv);
    });

    themeOption.appendChild(colorContainer);

    // Theme name
    const nameSpan = document.createElement('span');
    nameSpan.className = 'theme-name';
    nameSpan.textContent = theme.name;
    themeOption.appendChild(nameSpan);

    // Add click event
    themeOption.addEventListener('click', function(event) {
        // Only allow theme change if dropdown is actually open
        if (!themeDropdown.classList.contains('active')) {
            event.stopPropagation();
            return;
        }

        event.stopPropagation();

        // Apply theme colors dynamically for themes that don't have CSS definitions
        // For themes that have CSS definitions, we'll rely on the data-theme attribute
        applyThemeColors(theme);

        // Set the data-theme attribute so CSS themes can be applied
        body.setAttribute('data-theme', theme.id);

        // Remove active class from all theme options
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.remove('active');
        });

        // Add active class to clicked theme
        this.classList.add('active');

        // Close dropdown after selection
        themeDropdown.classList.remove('active');
        updateThemeOptionsCursor();

        // Sync theme across pages except docs
        if (!window.location.pathname.includes('/docs/')) {
            localStorage.setItem('deployz-theme', theme.id);
        }

        showToast(`Theme changed to ${theme.name}`);
    });

    return themeOption;
}

function setupPagination() {
    themePagination.innerHTML = '';
    
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'theme-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-page', i);
        
        dot.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            showPage(page);
        });
        
        themePagination.appendChild(dot);
    }
    
    // Update arrow states
    updateArrowStates();
}

function updateThemeElements() {
    // Update global variables with new elements
    window.themePages = document.querySelectorAll('.theme-page');
    window.themeOptions = document.querySelectorAll('.theme-option');
    window.themeDots = document.querySelectorAll('.theme-dot');
    
    // Reattach event listeners for dots
    window.themeDots.forEach(dot => {
        dot.addEventListener("click", function() {
            const page = parseInt(this.getAttribute("data-page"));
            showPage(page);
        });
    });
}

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
    document.querySelectorAll('.theme-page').forEach(p => {
        p.classList.remove("active");
    });
    
    // Show current page
    const pageElement = document.getElementById(`page-${page}`);
    if (pageElement) {
        pageElement.classList.add("active");
    }
    
    // Update dots
    document.querySelectorAll('.theme-dot').forEach((dot, index) => {
        if (index === page) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });

    // Update arrows
    updateArrowStates();
}

function updateArrowStates() {
    if (prevArrow) prevArrow.disabled = currentPage === 0;
    if (nextArrow) nextArrow.disabled = currentPage === totalPages - 1;
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

if (themeGridContainer) {
    themeGridContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    themeGridContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

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

if (themeButton) {
    themeButton.addEventListener("click", function(event) {
        event.stopPropagation();
        themeDropdown.classList.toggle("active");
        updateThemeOptionsCursor(); // update cursor styles based on dropdown state
    });
}

document.addEventListener("click", function(event) {
    // Close DropDown if clicking outside the button and dropdown
    if (themeButton && themeDropdown && 
        !themeButton.contains(event.target) && 
        !themeDropdown.contains(event.target)) {
        themeDropdown.classList.remove("active");
        updateThemeOptionsCursor();
    }
});

// Update cursor style based on dropdown state
function updateThemeOptionsCursor() {
    const allThemeOptions = document.querySelectorAll('.theme-option');
    allThemeOptions.forEach(option => {
        if (themeDropdown && themeDropdown.classList.contains("active")) {
            option.style.cursor = "pointer";
            option.style.opacity = "1";
        } else {
            option.style.cursor = "default";
            option.style.opacity = "0.6";
        }
    });
}

function restoreSavedTheme() {
    // Only sync theme if not on docs page
    if (window.location.pathname.includes('/docs/')) {
        return;
    }

    const savedTheme = localStorage.getItem("deployz-theme");
    if (savedTheme) {
        // Find the theme object
        const theme = themes.find(t => t.id === savedTheme);
        if (theme) {
            // Apply theme colors dynamically for themes that don't have CSS definitions
            // For themes that have CSS definitions, we'll rely on the data-theme attribute
            applyThemeColors(theme);
        }

        // Set the data-theme attribute so CSS themes can be applied
        body.setAttribute("data-theme", savedTheme);

        // you/we need to wait for the DOM to be updated before trying to find the element
        setTimeout(() => {
            const allThemeOptions = document.querySelectorAll('.theme-option');
            allThemeOptions.forEach(option => {
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
        }, 0);
    }
}

if (prevArrow) prevArrow.addEventListener("click", prevPage);
if (nextArrow) nextArrow.addEventListener("click", nextPage);

// Keyboard navigation
document.addEventListener("keydown", function(e) {
    if (themeDropdown && themeDropdown.classList.contains("active")) {
        if (e.key === "ArrowLeft") {
            prevPage();
        } else if (e.key === "ArrowRight") {
            nextPage();
        }
    }
});

window.addEventListener("scroll", function() {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = "var(--surface-color)";
        } else {
            navbar.style.backgroundColor = "var(--navbar-bg)";
        }
    }
});

// Load themes when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Initialize year in footer if element exists
    const yearSpan = document.getElementById("copyright-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Load themes from CSS instead of JSON
    loadThemesFromCSS();
});


