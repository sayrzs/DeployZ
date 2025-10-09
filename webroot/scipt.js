const themes = ['dark', 'matrix', 'dracula', 'nord', 'cyberpunk', 'monokai', 'github-dark'];
let currentTheme = localStorage.getItem('selectedTheme') || 'dark';

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('selectedTheme', theme);
    currentTheme = theme;
    
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    document.getElementById('themeDropdown').classList.remove('show');
    
    if (theme === 'matrix') {
        initMatrixRain();
    } else {
        stopMatrixRain();
    }
}

function toggleThemeDropdown() {
    const dropdown = document.getElementById('themeDropdown');
    dropdown.classList.toggle('show');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-switcher')) {
        document.getElementById('themeDropdown').classList.remove('show');
    }
});

let matrixInterval;
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

function initMatrixRain() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    matrixInterval = setInterval(draw, 35);
}

function stopMatrixRain() {
    clearInterval(matrixInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('DOMContentLoaded', () => {
    if (currentTheme !== 'dark') {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'matrix') {
            initMatrixRain();
        }
    }
});

window.addEventListener('resize', () => {
    if (currentTheme === 'matrix') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});