
import { useState } from 'react'
import { Link } from 'react-router-dom'
import profileIcon from '../assets/profile-icon.png'


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
