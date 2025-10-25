# DeployZ Changelog

All notable changes to DeployZ will be documented in this file.

## [Unreleased]

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
