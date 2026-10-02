import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Workspace } from './pages/Workspace'
import { Home } from './pages/Home'

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
     </Router>
  )
  
}

export default App
