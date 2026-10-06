import './Login.css'


export const Login = () => {
    return (
        <div className="login-container">
            <div className="header">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>
        <div className="inputs">
        <div className="input2">
            <input type="text" placeholder="Username" />
        </div>
        <div className="input2">
            <input type="text" placeholder="Email" />
        </div>
        <div className="input2">
            <input type="text" placeholder="Password" />
        </div>
        </div>
        </div>

    )


//export function Login() {
  //  return (
    //    <>
      //  <h1>This is the Login!</h1>
        //</>
    //)
}