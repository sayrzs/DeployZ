import { useState } from 'react'
import { Play, Github, Zap, Code, Cube, PaintBrush, Rocket, Flask, Info, Heart } from 'lucide-react'
import ThemeSwitcher from './components/ThemeSwitcher'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <img src="/assets/images/logo.png" alt="DeployZ Logo" />
            <span>DeployZ</span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Rocket size={16} />
            <span>Powered by Vite 6</span>
          </div>
          <h1 className="hero-title">
            Build <span className="highlight">Modern Web Apps</span> with React + Vite
          </h1>
          <p className="hero-subtitle">
            Experience lightning-fast development with hot module replacement, 24 stunning themes, and seamless DeployZ integration.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary">
              <Play size={18} />
              <span>Get Started</span>
            </button>
            <a href="https://github.com/sayrzs/deployz" className="cta-button secondary" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Why Choose This Stack?</h2>
          <p className="section-subtitle">Everything you need for modern web development</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3>Lightning Fast HMR</h3>
            <p>Instant hot module replacement with Vite. See your changes in milliseconds, not seconds.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Code size={32} />
            </div>
            <h3>Modern React 18</h3>
            <p>Built with the latest React 18 features including concurrent rendering and automatic batching.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Cube size={32} />
            </div>
            <h3>Component Based</h3>
            <p>Clean, modular architecture with reusable components. Easy to customize and extend.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <PaintBrush size={32} />
            </div>
            <h3>CSS Variables</h3>
            <p>Theme system built on CSS custom properties. Consistent styling across all components.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Rocket size={32} />
            </div>
            <h3>Production Ready</h3>
            <p>Optimized builds with code splitting, tree shaking, and minification out of the box.</p>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <div className="demo-card">
          <h2>
            <Flask size={28} />
            <span>Interactive Demo</span>
          </h2>
          <p>Test React's reactivity with this simple counter. Click to increment!</p>
          <button className="counter-button" onClick={() => setCount(count + 1)}>
            <span>Count: {count}</span>
          </button>
          <p className="demo-hint">
            <Info size={16} />
            <span>Edit <code>src/App.jsx</code> to customize this app</span>
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            <Heart size={16} />
            <span>Built with React and Vite</span>
          </p>
          <p className="footer-copyright">
            <span>Powered by</span>
            <a href="https://github.com/sayrzs/deployz" target="_blank" rel="noopener noreferrer">DeployZ</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
