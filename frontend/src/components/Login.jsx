import CommunityOption from "./CommunityOption"
import { useSelector, useDispatch } from "react-redux"
import { loginWith } from "../service/auth"
import { setUser } from "../reducer/userReducer"
import { clearCommunityId } from "../reducer/communityIdReducer"
import { Link, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { notifyError } from "../reducer/errorReducer"
import Error from "./Notifications/Error"
import { notifyConfirmation } from "../reducer/confirmationReducer"
import Confirmation from './Notifications/Confirmation'


const Login = () => {

  const [showPassword, setShowPassword] = useState(false)
  
  const communityId = useSelector(state => state.communityId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' }) 
  }, [])
  
  useEffect(() => {
    dispatch(clearCommunityId())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const handleSignUp = () => {
    dispatch(clearCommunityId())
    navigate('/signup')
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()

    const username = event.target.loginUsername.value
    const password = event.target.loginPassword.value

    if (!username || !password) {
      dispatch(notifyError("Please enter your login details.", 4))
      return
    }  

    const userLogin = {
      username,
      password
    }
    
    const userForLogin = {
      ...userLogin,
      communityId
    }
   
    try {
     const loggedUser = await loginWith(userForLogin)
     
     dispatch(setUser(loggedUser))
     localStorage.setItem('isLoggedIn', 'true')
     dispatch(notifyConfirmation(`Welcome back ${loggedUser.name ? loggedUser.name : loggedUser.username}!`, 5))
     reset(event)
     navigate('/')

   } catch (error) {
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
      <div className="loginContainer">
        <h2 className="loginContainerChild loginHeader">Log in to connect with your local community</h2>
        <Confirmation />        
        <CommunityOption />
        <form onSubmit={handleLogin} className="loginContainerChild">
          <label htmlFor="loginUsername" className="loginContainerChild">
          username:<span className='required'>*</span></label>

          <input name="loginUsername" type="text" autoComplete="username" className="loginContainerChild" id="loginUsername" placeholder="enter your username"/>
          
          <label htmlFor="loginPassword" className="loginContainerChild passwordLabel">
          password:<span className='required'>*</span></label>

          <div className="loginContainerChild password">
            <input name="loginPassword" type={showPassword ? "text" : "password"} autoComplete="current-password" id="loginPassword" className="loginContainerChild passwordField" placeholder="enter your password" />
            <img role="show and hide password button" src={showPassword ? './eye.svg' : './eye-off.svg'} onClick={() => setShowPassword(!showPassword)} className="eye"/>
          </div>
          <button type="submit" className="loginContainerChild loginButton" id="login-button">log in</button>
        </form>
        <Error />
        <Link to='/password-reset' className="textLink forgotPassword"><p>Forgot password</p></Link>

        <p className="loginContainerChild forSignUp">Don't have an account yet? <span onClick={handleSignUp} className="textLink">Sign up</span></p>
      </div>
    
    
  )
}

export default Login