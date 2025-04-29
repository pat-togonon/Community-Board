import SignUp from "./Signup"
import { useState } from "react"
import CommunityOption from "./CommunityOption"
import { useSelector, useDispatch } from "react-redux"
import { loginWith } from "../service/login"
import { setUser } from "../reducer/userReducer"

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(true)

  const communityId = useSelector(state => state.communityId)
  const dispatch = useDispatch()

  const handleSignUp = (event) => {
    setShowSignUp(!showSignUp)  
    setShowLogin(!showLogin)
  }

  const loginStyle = { display: showLogin ? '' : "none"}
  
  const showLoginForm = (event) => {
    setShowSignUp(!showSignUp)  
    setShowLogin(!showLogin)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('community id after submit login', communityId)
    const username = event.target.loginUsername.value
    const password = event.target.loginPassword.value
    const userLogin = {
      username,
      password
    }
    dispatch(setUser(userLogin))
    console.log('user login', userLogin)
   
    try {
     const loggedUser = await loginWith(username, password, communityId)
     console.log('logged in user', loggedUser)
     dispatch(setUser(loggedUser))
   } catch (error) {
    console.log('invalid login', error.response.data.error)

   }
  }

  return (
    <div>
      <div style={loginStyle}>
        <h2>Log in to connect with your local community</h2>
        <CommunityOption />
        <form onSubmit={handleLogin}>
          username: <input name="loginUsername" type="text" autoComplete="currentLoginUsername" /><br />
          password: <input name="loginPassword" type="password" autoComplete="currentLoginPassword"/><br />
          <button type="submit">log in</button>
        </form>
        <p>Forgot password</p>
        <p>Don't have an account yet? <button onClick={handleSignUp}>Sign up</button></p>
      </div>
      <div>
        {showSignUp ? <SignUp showLogin={showLoginForm}/> : ''}
      </div>
    </div>
  )
}

export default Login