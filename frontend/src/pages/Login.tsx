import './Login.css'
import { Link } from 'react-router-dom';

export const Login = () => {
    
    const handleLogin = () => {
        // Handle login logic here
        console.log('Login button clicked');
    };

    return ( 
        <div className="login-container"> 
            <div className="login-header">Sign In</div>

            <div className="login-window">
                <div className="login-fields">
                    <label htmlFor="username">Username or Email</label>
                    <input id="email" type="email" placeholder="Username or Email Address" />
                </div>

                <div className="login-fields">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="Password" />
                </div>
            
                <button type="button" className="login-button" onClick={handleLogin}>
                    Login
                </button>
            </div>

                <div className="register-link">
                    <span>Don't Have an Account?</span>
                    <Link to="/register" className="register-button">Register</Link>
                </div>
        </div>
    );


//export function Login() {
  //  return (
    //    <>
      //  <h1>This is the Login!</h1>
        //</>
    //)
    // May readd after login-container
    //style={{backgroundImage: `url(${cork})`}}>
}