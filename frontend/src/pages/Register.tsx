import './Register.css'
import cork from '../assets/6443928-large-corkboard-texture-or-background.jpg';

export const Register = () => {
    const handleRegister = () => {
        // Handle register logic here
        console.log('Register button clicked!');
    };
    return (
        <div className="register-container" style={{backgroundImage: `url(${cork})`}}>
            <div className="header">
                <div className="text">Register</div>
            </div>
            <form className="registration-form"
            onSubmit={(event) => {
                event.preventDefault();
                handleRegister();
            }}>
                <div className="inputs">
                    <div className="email-input">
                        <input type="text" placeholder="Username or Email Address" />
                    </div>
                    <div className="password-input">
                        <input type="password" placeholder="Password" />
                    </div>
                    <div className="checkbox">
                        <input type="checkbox" id="option" />
                        <label htmlFor="option">Label</label>
                        <p>Description</p>
                    </div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}