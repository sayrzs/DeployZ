import { useState, useEffect } from 'react'
import { Palette, ChevronDown } from 'lucide-react'
import './ThemeSwitcher.css'

const themes = [
  { id: 'github', name: 'GitHub', colors: ['#0d1117', '#161b22', '#58a6ff'] },
  { id: 'dracula', name: 'Dracula', colors: ['#282a36', '#bd93f9', '#ff79c6'] },
  { id: 'nord', name: 'Nord', colors: ['#2e3440', '#88c0d0', '#81a1c1'] },
  { id: 'monokai', name: 'Monokai', colors: ['#272822', '#a6e22e', '#f8f8f2'] },
  { id: 'onedark', name: 'One Dark', colors: ['#282c34', '#61afef', '#528fcc'] },
  { id: 'vscode', name: 'VS Code', colors: ['#1e1e1e', '#007acc', '#005a9e'] },
  { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#0a0e27', '#ff00ff', '#ff00aa'] },
  { id: 'synthwave-84', name: "Synthwave '84", colors: ['#2a2139', '#f92aad', '#e8457c'] },
]

function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('github')

  useEffect(() => {
    const savedTheme = localStorage.getItem('deployz-theme') || 'github'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('deployz-theme', themeId)
    setIsOpen(false)
  }

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0]

  return (
    <div className="theme-switcher">
      <button 
        className="theme-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch theme"
      >
        <Palette size={18} />
        <span className="theme-button-text">{currentThemeData.name}</span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="theme-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="theme-dropdown">
            <div className="theme-grid">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                  onClick={() => handleThemeChange(theme.id)}
                  title={theme.name}
                >
                  <div className="theme-colors">
                    {theme.colors.map((color, idx) => (
                      <div key={idx} className="theme-color" style={{ background: color }}></div>
                    ))}
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeSwitcher
