# DeployZ React App

A modern, lightweight React application powered by Vite, designed to work seamlessly with DeployZ's deployment infrastructure.

## ✨ Features

- **⚡ Lightning Fast** - Powered by Vite for instant HMR and optimized builds
- **🎨 15 Beautiful Themes** - Switch between GitHub, Matrix, Dracula, Nord, Cyberpunk, and more
- **📱 Fully Responsive** - Looks great on all devices and screen sizes
- **🎯 Modern Design** - Clean, polished UI with smooth transitions and animations
- **🔧 Easy to Customize** - Well-organized code structure for easy modifications
- **📦 Lightweight** - Minimal dependencies, fast loading times

## 🚀 Getting Started

### Installation

```bash
cd react-app
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app in development mode with hot module replacement.

### Build for Production

```bash
npm run build
```

This builds the app to `../webroot/` directory, making it ready to be served by DeployZ.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Theme System

The app includes 15 pre-configured themes that match DeployZ's design system:

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

Themes are automatically saved to localStorage and persist across sessions.

## 📁 Project Structure

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
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🛠️ Customization

### Adding New Sections

Edit `src/App.jsx` to add new sections. The app uses a component-based structure for easy modifications.

### Styling

- Global styles and theme variables: `src/index.css`
- Component-specific styles: `src/App.css`
- Theme switcher styles: `src/components/ThemeSwitcher.css`

### Adding New Themes

Add new theme definitions in `src/index.css`:

```css
[data-theme="your-theme"] {
  --bg-color: #000000;
  --surface-color: #111111;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --accent-color: #ff0000;
  --accent-hover: #cc0000;
  /* ... other variables */
}
```

Then add the theme to the `themes` array in `src/components/ThemeSwitcher.jsx`.

## 🔧 Configuration

### Build Output

The Vite configuration is set to build to `../webroot/` with `emptyOutDir: false` to preserve existing DeployZ files.

To change the output directory, edit `vite.config.js`:

```javascript
export default defineConfig({
  build: {
    outDir: '../webroot/',
    emptyOutDir: false
  }
})
```

## 📦 Dependencies

- **react** (^18.3.1) - UI library
- **react-dom** (^18.3.1) - React DOM renderer
- **vite** (^6.0.3) - Build tool
- **@vitejs/plugin-react** (^4.3.4) - Vite React plugin

## 🎯 Best Practices

- Keep components small and focused
- Use CSS variables for theming
- Follow the existing code style
- Test on multiple devices and themes
- Optimize images and assets

## 📝 License

This project is part of DeployZ. See the main DeployZ repository for license information.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and test your changes across different themes.

---

**Built with ❤️ for DeployZ**
