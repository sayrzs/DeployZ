import { useState, useEffect } from 'react'
import { Palette, ChevronDown, ChevronLeft, ChevronRight, Github, Code, Moon, Snowflake, MessageCircle, Flame, Contrast, Terminal, Sun, Box, Cpu, Leaf, Atom, Smartphone, Moon as MoonIcon, Music, User, Coffee, Building, Briefcase, Plus, Zap, Settings } from 'lucide-react'
import './ThemeSwitcher.css'

const themes = [
  { id: 'github', name: 'GitHub', colors: ['#0d1117', '#161b22', '#58a6ff'], icon: Github },
  { id: 'matrix', name: 'Matrix', colors: ['#0a0a0a', '#00ff41', '#00cc33'], icon: Terminal },
  { id: 'dracula', name: 'Dracula', colors: ['#282a36', '#bd93f9', '#ff79c6'], icon: Moon },
  { id: 'nord', name: 'Nord', colors: ['#2e3440', '#88c0d0', '#81a1c1'], icon: Snowflake },
  { id: 'discord', name: 'Discord', colors: ['#36393f', '#7289da', '#5a6ebf'], icon: MessageCircle },
  { id: 'monokai', name: 'Monokai', colors: ['#272822', '#a6e22e', '#f8f8f2'], icon: Flame },
  { id: 'onedark', name: 'One Dark', colors: ['#282c34', '#61afef', '#528fcc'], icon: Contrast },
  { id: 'vscode', name: 'VS Code', colors: ['#1e1e1e', '#007acc', '#005a9e'], icon: Code },
  { id: 'solarized-dark', name: 'Solarized Dark', colors: ['#002b36', '#268bd2', '#2aa198'], icon: Sun },
  { id: 'gruvbox-dark', name: 'Gruvbox Dark', colors: ['#282828', '#fb4934', '#ebdbb2'], icon: Box },
  { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#0a0e27', '#ff00ff', '#ff00aa'], icon: Cpu },
  { id: 'rose-pine', name: 'Rose Pine', colors: ['#191724', '#ebbcba', '#f6c177'], icon: Leaf },
  { id: 'atom-one-dark', name: 'Atom One Dark', colors: ['#21252b', '#e06c75', '#be5046'], icon: Atom },
  { id: 'material-dark', name: 'Material Dark', colors: ['#121212', '#bb86fc', '#3700b3'], icon: Smartphone },
  { id: 'palenight', name: 'Palenight', colors: ['#292d3e', '#82aaff', '#5c7bd9'], icon: MoonIcon },
  { id: 'night-owl', name: 'Night Owl', colors: ['#011627', '#7fdbca', '#5ebdab'], icon: MoonIcon },
  { id: 'synthwave-84', name: "Synthwave '84", colors: ['#2a2139', '#f92aad', '#e8457c'], icon: Music },
  { id: 'github-high-contrast', name: 'GitHub High Contrast', colors: ['#010409', '#58a6ff', '#79c0ff'], icon: User },
  { id: 'ayu-dark', name: 'Ayu Dark', colors: ['#0f1419', '#ffcc66', '#ffb347'], icon: Sun },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', colors: ['#1e1e2e', '#f38ba8', '#eba0ac'], icon: Coffee },
  { id: 'gotham', name: 'Gotham', colors: ['#0c1014', '#4e89ae', '#3a6b8a'], icon: Building },
  { id: 'one-pro', name: 'One Pro', colors: ['#232830', '#2aacb8', '#1e8a94'], icon: Briefcase },
  { id: 'dark-plus', name: 'Dark+', colors: ['#1a1d23', '#569cd6', '#4a8bc2'], icon: Plus },
  { id: 'neon', name: 'Neon', colors: ['#0a0a0a', '#00ffff', '#00cccc'], icon: Zap },
]

function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('github')
  const [currentPage, setCurrentPage] = useState(0)
  const [showCustomTheme, setShowCustomTheme] = useState(false)
  const [customTheme, setCustomTheme] = useState({
    name: 'Custom Theme',
    colors: ['#1e1e1e', '#007acc', '#005a9e']
  })
  
  // Pagination: 8 themes per page
  const themesPerPage = 8
  const totalPages = Math.ceil(themes.length / themesPerPage) // 24 themes = 3 pages
  
  // Get themes for current page
  const getCurrentPageThemes = () => {
    const startIndex = currentPage * themesPerPage
    const endIndex = startIndex + themesPerPage
    return themes.slice(startIndex, endIndex)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('deployz-theme') || 'github'
    const savedCustomTheme = localStorage.getItem('deployz-custom-theme')
    
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    
    if (savedCustomTheme) {
      try {
        const parsed = JSON.parse(savedCustomTheme)
        setCustomTheme(parsed)
        setShowCustomTheme(true)
      } catch (e) {
        console.error('Failed to parse custom theme', e)
      }
    }
    
    // Find the page of the saved theme
    const themeIndex = themes.findIndex(t => t.id === savedTheme)
    if (themeIndex !== -1) {
      const pageIndex = Math.floor(themeIndex / themesPerPage)
      setCurrentPage(pageIndex)
    }
  }, [])

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('deployz-theme', themeId)
    setIsOpen(false)
  }
  
  const handleCustomThemeChange = (newColors) => {
    const updatedCustomTheme = {
      ...customTheme,
      colors: newColors
    }
    setCustomTheme(updatedCustomTheme)
    localStorage.setItem('deployz-custom-theme', JSON.stringify(updatedCustomTheme))
    
    // If custom theme is active, update it immediately
    if (currentTheme === 'custom') {
      document.documentElement.setAttribute('data-theme', 'custom')
    }
  }
  
  const handleCustomThemeNameChange = (name) => {
    const updatedCustomTheme = {
      ...customTheme,
      name
    }
    setCustomTheme(updatedCustomTheme)
    localStorage.setItem('deployz-custom-theme', JSON.stringify(updatedCustomTheme))
  }
  
  const goToPage = (page) => {
    setCurrentPage(page)
  }
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const currentThemeData = (() => {
    if (currentTheme === 'custom') {
      return {
        id: 'custom',
        name: customTheme.name,
        colors: customTheme.colors,
        icon: Settings
      }
    }
    return themes.find(t => t.id === currentTheme) || themes[0]
  })()
  
  // Find current theme index
  const currentIndex = themes.findIndex(t => t.id === currentTheme)
  const prevIndex = (currentIndex - 1 + themes.length) % themes.length
  const nextIndex = (currentIndex + 1) % themes.length
  
  const prevTheme = themes[prevIndex]
  const nextTheme = themes[nextIndex]

  return (
    <div className="theme-switcher">
      <div className="theme-arrows">
        <button 
          className="theme-arrow-button prev" 
          onClick={() => handleThemeChange(prevTheme.id)}
          aria-label="Previous theme"
        >
          <ChevronLeft size={16} />
        </button>
        
        <button 
          className="theme-button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Switch theme"
        >
          <Palette size={18} />
          <span className="theme-button-text">{currentThemeData.name}</span>
          <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
        </button>
        
        <button 
          className="theme-arrow-button next" 
          onClick={() => handleThemeChange(nextTheme.id)}
          aria-label="Next theme"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="theme-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="theme-dropdown">
            <div className="theme-grid-container">
              <div className="theme-grid">
                {getCurrentPageThemes().map((theme) => {
                  const IconComponent = theme.icon
                  return (
                    <button
                      key={theme.id}
                      className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                      onClick={() => handleThemeChange(theme.id)}
                      title={theme.name}
                    >
                      <div className="theme-icon">
                        <IconComponent size={20} />
                      </div>
                      <div className="theme-colors">
                        {theme.colors.map((color, idx) => (
                          <div key={idx} className="theme-color" style={{ background: color }}></div>
                        ))}
                      </div>
                      <span className="theme-name">{theme.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="theme-navigation">
                <button 
                  className="theme-arrow" 
                  id="prev-arrow"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="theme-pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <div 
                      key={i}
                      className={`theme-dot ${currentPage === i ? 'active' : ''}`}
                      onClick={() => goToPage(i)}
                    ></div>
                  ))}
                </div>
                
                <button 
                  className="theme-arrow" 
                  id="next-arrow"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            
            {/* Custom Theme Editor */}
            {currentTheme === 'custom' && (
              <div className="custom-theme-editor">
                <h4>Custom Theme Editor</h4>
                <div className="custom-theme-controls">
                  <input
                    type="text"
                    value={customTheme.name}
                    onChange={(e) => handleCustomThemeNameChange(e.target.value)}
                    placeholder="Theme Name"
                    className="custom-theme-name-input"
                  />
                  <div className="custom-theme-colors">
                    {customTheme.colors.map((color, index) => (
                      <div key={index} className="custom-color-picker">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...customTheme.colors]
                            newColors[index] = e.target.value
                            handleCustomThemeChange(newColors)
                          }}
                        />
                        <span>Color {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeSwitcher