
import { useState } from 'react'
import { Link } from 'react-router-dom'
import profileIcon from '../assets/profile-icon.png'
import './Home.css'
import siftLogo from '../assets/sift_logo.png'

export function Home() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
    <div className="Signed-In-Home">

    <div className="The-Logo">
      <img src={siftLogo} alt="Sift Logo" className="sift-logo" />
    </div>
    <div className="The-Top-Box">
      {/* There must be text here for it show up, and this should be altered-
      -later for it to welcome the user by login name, but it's a temporary-
      -message for now. */}
          <h1> Welcome, USER</h1>
        </div>
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
          <Link to="/workspace">Go to Workspace</Link>
          <br />
          <Link to="/login">Log in</Link>
        </div>

      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>  
    </div>
    </>
  )
}
