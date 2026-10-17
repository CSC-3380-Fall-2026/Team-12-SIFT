import './Login.css'


export const Login = () => {
    
    const handleLogin = () => {
        // Handle login logic here
        console.log('Login button clicked');
    };
    return (
        <div className="login-container">
            <div className="login-window">
                <div className="header">
                    <div className="text">Sign In</div>
                    <div className="underline"></div>
                </div>
            <div className="inputs">
            <div className="input2">
                <input type="text" placeholder="Username/Email" />
            </div>
            <div className="input2">
                <input type="text" placeholder="Password" />
            </div>

            </div>
            <button type="button"
                className="login-button"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
      </div>
      
    );


//export function Login() {
  //  return (
    //    <>
      //  <h1>This is the Login!</h1>
        //</>
    //)
}