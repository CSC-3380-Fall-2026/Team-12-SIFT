import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Workspace } from './pages/Workspace'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { NeedNavbar } from './NeedNavbar'

function App() {
 
  return (
    <Router>
      <Routes>
        //if you want a page to have a Navbar, it must included under here. Otherwise, put it with login and register.
        <Route element={<NeedNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<Workspace />} />
        </Route>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
     </Router>
  )
  
}

export default App
