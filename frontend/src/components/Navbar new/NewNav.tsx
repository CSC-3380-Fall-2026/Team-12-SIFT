

import { Link } from "react-router-dom";
import "./NewNav.css";
import {useState} from "react";
import profileIcon from '../../assets/profile-icon.png'
import sift_logo from "../../assets/sift_logo.png";

type SiteNavBool = {
    showAuth?: boolean;
    showMyBoards?: boolean;
    showWelcome?: boolean;
    showProfile?: boolean;
    userName?: string;
};

export function SiteNavbar({
    showAuth = false,
    showMyBoards = false,
    showWelcome= false,
    showProfile= false,
    userName = "USER",
}: SiteNavBool) {
    const [isProfileOpen, setIsProfileOpen]= useState(false);

    return(
        <nav className="site-navbar">
            <div className="site-navbar-left">
                <Link to="/mainhome" className="sift_logo">
                    <img src={sift_logo}/>
                </Link>
                    

                {showMyBoards && (
                    <Link to="/" className="site-navbar-link">
                        My Boards
                    </Link>
                )}
            
                {showWelcome && (
                    <span className="site-navbar-welcome">
                        Welcome, {userName}
                    </span>
                )}
            </div>

            <div className="site-navbar-right">

                {showAuth && (
                    <>
                        <Link to="/login" className="site-navbar-link">
                            Log In
                        </Link>

                        <Link to="/register" className="site-navbar-link">
                            Register
                        </Link>
                    </>
                )}

                {showProfile &&(
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

                        {isProfileOpen &&(
                            <div className="settings-dropdown profile-dropdown">
                                <div className="profile-menu-option">
                                    Settings
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </nav>
    );
}