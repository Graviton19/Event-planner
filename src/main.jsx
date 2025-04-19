import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Get root element
const rootElement = document.getElementById('root')

// Ensure root element exists
if (!rootElement) {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

ReactDOM.createRoot(rootElement || document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
