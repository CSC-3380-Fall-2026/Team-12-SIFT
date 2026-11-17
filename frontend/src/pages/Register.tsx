import { useState } from 'react';
import './Register.css'
import { Link } from 'react-router-dom';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const handleRegister = () => {
        // Handle register logic here
        // use strict equality test for more security to ensure that user confirms password
        if (password !== confirmPassword) {
            alert("Password mismatch! Please try again.");
            return;
        }
        // displays registration details
        console.log("Registration details:", {
            username, email, password
        });
    };
    return (
        <div className="register-container" >
            <div className="header">
                <div className="text">Register</div>
            </div>
            <form className="registration-form"
            onSubmit={(event) => {
                event.preventDefault();
                handleRegister();
            }}>
                <div className="inputs">
                    <div className="username-input">
                        <input
                        type="text"
                        placeholder="username"
                        required
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div className="email-input">
                        <input
                        type="email"
                        placeholder="email address"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="password-input">
                        <input
                        type="password"
                        placeholder="password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="confirm-password-input">
                        <input
                        type="password"
                        placeholder="confirm your password"
                        required
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                   {/* <div className="checkbox">
                        <input type="checkbox" id="option" />
                        <label htmlFor="option">Label</label>
                        <p>Description</p>
                    </div> */}
                    <button type="submit">Register</button>
                </div>
            </form>

            <div>
                <div className="login-link">
                    <span>Already Have an Account? </span>
                    <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    )
}