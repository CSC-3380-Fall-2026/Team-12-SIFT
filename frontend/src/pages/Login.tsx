import './Login.css'
import cork from '../assets/6443928-large-corkboard-texture-or-background.jpg';

export const Login = () => {
    
    const handleLogin = () => {
        // Handle login logic here
        console.log('Login button clicked');
    };
    return (
        <div className="login-container" style={{backgroundImage: `url(${cork})`}}>
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
      </div>
      
    );


//export function Login() {
  //  return (
    //    <>
      //  <h1>This is the Login!</h1>
        //</>
    //)
}