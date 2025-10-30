import { useState } from 'react'
import { Info, Zap, Shield, RefreshCw, Globe, FileText, Palette, Server, Code, Heart } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'
import '../App.css'

function About() {
  const features = [
    {
      icon: <Zap size={32} />,
      title: 'Super Fast',
      description: 'Deploy apps in seconds, not minutes. No complex setup needed.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure',
      description: 'Built-in HTTPS and file protection. Your apps are safe.'
    },
    {
      icon: <RefreshCw size={32} />,
      title: 'Live Reload',
      description: 'See changes instantly. No more manual refreshing.'
    }
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <img src="../logo.png" alt="DeployZ Logo" />
            <span>DeployZ</span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Info size={16} />
            <span>About DeployZ - Hot Reload Test</span>
          </div>
          <h1 className="hero-title">
            Simple Deployment Tools for <span className="highlight">Web Apps</span>
          </h1>
          <p className="hero-subtitle">
            Making web deployment easy so you can focus on building cool stuff.
          </p>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">The stuff that makes DeployZ awesome</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <div className="icon-background"></div>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">What is DeployZ?</h2>
          <p className="section-subtitle">The simple explanation</p>
        </div>
        <div className="about-content">
          <p>
            DeployZ is basically a tool that makes deploying web apps way easier than it should be. 
            Whether you're building a simple website or a complex React app, DeployZ handles the 
            boring deployment stuff so you can focus on coding.
          </p>
          <p>
            Just configure a few settings in a JSON file and you're good to go. No need to mess 
            with complicated server setups or deployment pipelines.
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

export default About