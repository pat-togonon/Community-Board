import CommunityOption from "./CommunityOption"
import { useSelector, useDispatch } from "react-redux"
import { loginWith } from "../service/auth"
import { setUser } from "../reducer/userReducer"
import { clearCommunityId } from "../reducer/communityIdReducer"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { notifyError } from "../reducer/errorReducer"
import Error from "./Notifications/Error"
import { notifyConfirmation } from "../reducer/confirmationReducer"
import Confirmation from './Notifications/Confirmation'


const Login = () => {

  const [showPassword, setShowPassword] = useState(false)
  
  const userLoggedIn = useSelector(state => state.user.accessToken)

  const communityId = useSelector(state => state.communityId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (userLoggedIn) {
    return null
  }
  
  const handleSignUp = (event) => {
    dispatch(clearCommunityId())
    navigate('/signup')
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
    console.log('user login', userLogin)
    const userForLogin = {
      ...userLogin,
      communityId
    }
   
    try {
     const loggedUser = await loginWith(userForLogin)
     console.log('logged in user', loggedUser)
     dispatch(setUser(loggedUser))
     dispatch(notifyConfirmation(`Welcome back ${loggedUser.name ? loggedUser.name : loggedUser.username}!`, 5))
     reset(event)
     navigate('/')

   } catch (error) {
      console.log('invalid login', error.response.data.error)
      dispatch(notifyError(error.response.data.error, 5))
      reset(event)
      dispatch(clearCommunityId())
      navigate('/login')
   }
  }

  const reset = (event) => {
    event.target.loginUsername.value = ''
    event.target.loginPassword.value = ''
  }

  return (
      <div>
        <h2>Log in to connect with your local community</h2>
        <Error />
        <Confirmation />        
        <CommunityOption />
        <form onSubmit={handleLogin}>
          username: <input name="loginUsername" type="text" autoComplete="currentLoginUsername" /><br />
          password: <input name="loginPassword" type={showPassword ? "text" : "password"} autoComplete="currentLoginPassword"/><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide password" : "Show password"}</button><br />
          <button type="submit">log in</button>
        </form>
        <Link to='/password-reset'><p>Forgot password</p></Link>
        <p>Don't have an account yet? <button onClick={handleSignUp}>Sign up</button></p>
      </div>
    
    
  )
}

export default Login

// Add in a show pasword feature