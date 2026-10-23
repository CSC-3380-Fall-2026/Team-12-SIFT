import './Login.css'
import cork from '../assets/6443928-large-corkboard-texture-or-background.jpg';
import { Link } from 'react-router-dom';

export const Login = () => {
    
    const handleLogin = () => {
        // Handle login logic here
        console.log('Login button clicked');
    };
    return (
        
        <div className="login-container"> 
            <div className="header">
                <div className="text">Sign In</div>
                <div className="underline"></div>
            </div>
        <div className="inputs">
        <div className="email-input">
            <input type="text" placeholder="Username or Email Address" />
        </div>
        <div className="password-input">
            <input type="password" placeholder="Password" />
        </div>

            </div>
            <button type="button"
                className="login-button"
                onClick={handleLogin}
            >
                Login
            </button>


        <div>
            <Link to="/register">Don't have an account? Sign Up</Link>
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