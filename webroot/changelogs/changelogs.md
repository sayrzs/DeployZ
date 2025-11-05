# DeployZ Changelog

All notable changes to DeployZ will be documented in this file.

## [2.0.0] - 2025-10-28

### Added
- **React App Integration**: Full React + Vite application in `react-app/` directory
- **Lucide Icons**: Modern vector icons replacing Font Awesome throughout the React app
- **8 Premium Themes**: Curated selection of the best themes (GitHub, Dracula, Nord, Monokai, One Dark, VS Code, Cyberpunk, Synthwave '84)
- **Smooth Transitions**: Buttery-smooth theme switching with cubic-bezier easing (400ms)
- **Dual Deployment Support**: Configured for both static (webroot) and React app deployment on Vercel
- **Build Scripts**: Added `build:react` and `build` commands to package.json
- **Comprehensive CHANGELOG**: Root-level CHANGELOG.md documenting all changes

### Changed
- **Theme Switcher**: Redesigned with single-page layout for 8 themes, no pagination needed
- **Landing Page**: Simplified hero section, removed stats section, cleaner design
- **Feature Cards**: Reduced to 5 essential features with Lucide icons
- **Typography**: Enhanced font sizes (hero title 4rem, better letter-spacing)
- **Animations**: Improved fade-in effects with staggered timing using cubic-bezier
- **Icon System**: All icons now use Lucide React instead of Font Awesome
- **Theme Grid**: 4x2 layout for perfect 8-theme display without overflow

### Removed
- **Emoji Icons**: All emojis replaced with modern Lucide React icons
- **Theme/Open Source Stats**: Removed from hero section for cleaner design
- **Pagination**: Removed theme pagination (now showing 8 themes in single view)
- **16 Extra Themes**: Reduced from 24 to 8 carefully selected themes
- **Font Awesome**: Replaced with Lucide icons in React app

### Fixed
- **Theme Overflow**: Themes now display cleanly without right-side clipping
- **Transition Smoothness**: Significantly improved theme transition performance with optimized easing
- **Icon Alignment**: Perfect alignment of all icons with text using Lucide
- **Responsive Layout**: Better mobile experience with optimized breakpoints
- **Chevron Animation**: Smooth 180° rotation on theme dropdown toggle

### Technical
- **Dependencies**: Added `lucide-react` (v0.294.0) for modern icon system
- **Build Configuration**: Vite configured to build to `../webroot/`
- **Vercel Config**: Updated with `buildCommand` and `installCommand` for dual deployment
- **CSS Variables**: Enhanced theme system with smoother transitions
- **Performance**: Optimized animations using `cubic-bezier(0.4, 0, 0.2, 1)`
- **React 18**: Using latest React features including concurrent rendering

### Deployment
- **Static Site**: Serves from `webroot/` directory (HTML, CSS, JS, docs, assets)
- **React App**: Builds to `../webroot/` for integrated deployment
- **Vercel**: Automatic builds on push with preview deployments for PRs
- **Commands**: `npm run build` builds React app, `npm run dev` starts dev server

## [1.5.0] - 2025-10-27

### Added
- **Auto-HTTPS Feature**: Automatic HTTPS support with self-signed certificates for local development
- **Modular CSS Architecture**: Split CSS into separate files (themes.css, components.css, layout.css, responsive.css)
- **Changelogs Page**: Dedicated changelogs page with professional styling
- **Enhanced Theme System**: Improved theme switching with 24+ themes and better organization

### Changed
- **Landing Page Redesign**: Complete overhaul with hero section, feature cards, and modern layout
- **CSS Organization**: Modular CSS structure for better maintainability
- **Documentation**: Simplified and humanized all documentation files

### Fixed
- **CSS Syntax Error**: Fixed `rgba(var(--accent-color), 0.1)` syntax error in focus states
- **Theme Variables**: Added missing `--accent-color-alpha` variables for all themes

## [1.0.0] - 2025-10-25

### Added
- Initial release of DeployZ
- Static file server with Node.js
- Live reload functionality
- Per-domain page routing
- File blocking and logging features
- Debug logging system
- HTTP redirect support
- Vercel deployment support

### Features
- **Live Reload**: Automatic browser refresh on file changes
- **Domain Routing**: Different pages for different domains
- **Security**: File blocking and access logging
- **Debugging**: Comprehensive logging with multiple levels
- **Redirects**: HTTP 301 redirects for domain management

### Technical
- Node.js server with Express-like routing
- WebSocket support for live reload
- MIME type detection
- Configurable via JSON
- Cross-platform compatibility
