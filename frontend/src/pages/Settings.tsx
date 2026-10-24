import './Settings.css'
import cork from '../assets/6443928-large-corkboard-texture-or-background.jpg';
import { Link } from 'react-router-dom';

export const Settings = () => {
    return (
        <div className="settings-container">
            <div className="header">
                <div className="text">Settings</div>
                <div className="underline"></div>
            </div>
            <div className="settings-section">
                <h3>Account Settings</h3>
                <p>Change your email address or username.</p>
                <button type="button">Edit Profile</button>
            </div>
            <div className="settings-section">
                <h3>Your Preferences</h3>
                <label>
                    <input type="checkbox" />
                    Enable Push Notifications
                </label>
                <br />
                <label>
                    <input type="checkbox" />
                    Toggle Dark Theme
                </label>
            </div>
            <div className="settings-section">
                <h3>Account Security</h3>
                <button type="button">Change Password</button>
            </div>
            <div>
                <Link to="/login">Back to Login Page</Link>
            </div>
        </div>
    );
};