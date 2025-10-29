import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import About from './components/About.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

// Simple routing based on URL path
const getPath = () => {
  // Get the path from the URL, removing any query parameters
  const path = window.location.pathname.split('?')[0]
  return path
}

const renderApp = () => {
  const path = getPath()
  
  let ComponentToRender = App
  
  // Route matching
  if (path === '/about') {
    ComponentToRender = About
  }
  // Add more routes here as needed
  // else if (path === '/changelogs') {
  //   ComponentToRender = Changelogs
  // }
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ComponentToRender />
    </React.StrictMode>
  )
}

// Initial render
renderApp()

// Listen for back/forward button navigation
window.addEventListener('popstate', renderApp)