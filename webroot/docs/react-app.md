# React App Guide

This guide explains how to use the DeployZ React application powered by Vite.

## Overview

The React app is a modern, lightweight application that builds directly to DeployZ's `webroot/` directory. It features 15 beautiful themes, smooth transitions, and a clean design.

## Getting Started

### Installation

Navigate to the `react-app/` directory and install dependencies:

```bash
cd react-app
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

Build the app to the `webroot/` directory:

```bash
npm run build
```

The built files will be placed in `../webroot/` and served by DeployZ.

## Features

### Theme System

The app includes 15 pre-configured themes:

- **GitHub** - Clean dark theme with blue accents
- **Matrix** - Green terminal aesthetic
- **Dracula** - Purple/pink dark theme
- **Nord** - Arctic blue aesthetic
- **Discord** - Purple/blue Discord-inspired
- **Monokai** - Classic green/orange
- **One Dark** - VS Code inspired
- **VS Code** - Official VS Code dark theme
- **Solarized Dark** - Popular Solarized theme
- **Gruvbox Dark** - Retro warm colors
- **Cyberpunk** - Neon magenta aesthetic
- **Rose Pine** - Warm dark theme
- **Synthwave '84** - Retro neon vibes
- **Night Owl** - Teal dark theme
- **Neon** - Bright cyan aesthetic

Themes are organized in pages (8 themes per page) with smooth pagination. Use the arrow buttons or dots to navigate between pages.

### Theme Switcher

Click the theme button in the navbar to open the theme selector. The current theme is saved to localStorage and persists across sessions.

## Project Structure

```
react-app/
├── src/
│   ├── components/
│   │   ├── ThemeSwitcher.jsx    # Theme switching component
│   │   └── ThemeSwitcher.css    # Theme switcher styles
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # App styles
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles & themes
├── index.html                    # HTML entry point
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

## Customization

### Adding Content

Edit `src/App.jsx` to add new sections or modify existing content. The app uses a component-based structure for easy modifications.

### Styling

- **Global styles and themes**: `src/index.css`
- **Component styles**: `src/App.css`
- **Theme switcher**: `src/components/ThemeSwitcher.css`

All styles use CSS variables for theming, making it easy to maintain consistency.

### Adding New Themes

1. Add theme definition in `src/index.css`:

```css
[data-theme="your-theme"] {
  --bg-color: #000000;
  --surface-color: #111111;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --accent-color: #ff0000;
  --accent-hover: #cc0000;
  --border-color: #333333;
  --code-bg: #000000;
  --gradient-start: #000000;
  --gradient-end: #111111;
  --shadow-color: rgba(255, 0, 0, 0.2);
  --card-bg: #111111;
  --scrollbar-bg: #000000;
  --scrollbar-thumb: #333333;
  --scrollbar-thumb-hover: #ff0000;
}
```

2. Add theme to `src/components/ThemeSwitcher.jsx` in the `themePages` array:

```javascript
{ id: 'your-theme', name: 'Your Theme', icon: 'fas fa-star', colors: ['#000', '#111', '#f00'] }
```

## Configuration

### Build Output

The Vite configuration outputs to `../webroot/` with `emptyOutDir: false` to preserve existing DeployZ files.

Edit `vite.config.js` to change build settings:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../webroot/',
    emptyOutDir: false,
    assetsDir: 'assets'
  }
})
```

## Dependencies

- **react** (^18.3.1) - UI library
- **react-dom** (^18.3.1) - React DOM renderer
- **vite** (^6.0.3) - Build tool and dev server
- **@vitejs/plugin-react** (^4.3.4) - Vite React plugin

## Tips

- Use `npm run dev` for development with hot reload
- Themes automatically save to localStorage
- The app is optimized for production builds
- All icons use Font Awesome 6.4.0
- The logo is located at `/assets/images/logo.png`

## Troubleshooting

### Build Issues

If you encounter build errors, try:

```bash
rm -rf node_modules
npm install
npm run build
```

### Theme Not Persisting

Clear your browser's localStorage and reload the page.

### Port Already in Use

If port 5173 is in use, Vite will automatically use the next available port.

---

**Need help?** Check the main [DeployZ documentation](/) or visit the [GitHub repository](https://github.com/sayrzs/deployz).
