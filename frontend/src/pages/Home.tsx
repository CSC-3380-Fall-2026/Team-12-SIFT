
import { useState } from 'react'
import { Link } from 'react-router-dom'
import profileIcon from '../assets/profile-icon.png'
// heroImg from './src/assets/hero.png'
//import reactLogo from './src/assets/react.svg'
//import viteLogo from './src/assets/vite.svg'
//import './App.css'

export function Home() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <section className="home-profile-container">
        <button
          type="button"
          className="profile-button"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          aria-label="Profile"
          aria-expanded={isProfileOpen}
        >
          <img
            src={profileIcon}
            alt=""
            className="home-profile-icon"
          />
        </button>
        {isProfileOpen && (
          <div className="settings-dropdown profile-dropdown">
            <div className="profile-menu-option">
              Settings
            </div>
          </div>
        )}
      </section>

      <section id="center">
       {/*  <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div> */}
        <div>
          <h1>This is a homepage! Test Test!</h1>
          <Link to="/workspace">Go to Workspace</Link>
          <br />
          <Link to="/login">Log in</Link>
        </div>

      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}
