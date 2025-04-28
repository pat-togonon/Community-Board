import SignUp from "./Signup"
import { useState } from "react"

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(true)

  const handleSignUp = (event) => {
    setShowSignUp(!showSignUp)  
    setShowLogin(!showLogin)
  }

  const loginStyle = { display: showLogin ? '' : "none"}
  
  const handleLogin = (event) => {
    setShowSignUp(!showSignUp)  
    setShowLogin(!showLogin)
  }



  return (
    <div>
      <div style={loginStyle}>
        <h2>Log in to connect with your local community</h2>
        <form>
          local community: <select></select><br />
          username: <input name="login-username" type="text" autoComplete="current-login-username"/><br />
          password: <input name="login-password" type="password" autoComplete="current-password"/><br />
          <button type="submit">log in</button>
        </form>
        <p>Forgot password</p>
        <p>Don't have an account yet? <button onClick={handleSignUp}>Sign up</button></p>
      </div>
      <div>
        {showSignUp ? <SignUp handleLogin={handleLogin}/> : ''}
      </div>
    </div>
  )
}

export default Login