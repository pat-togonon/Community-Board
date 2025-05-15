import SignUp from "./Signup"
import { useState } from "react"
import CommunityOption from "./CommunityOption"
import { useSelector, useDispatch } from "react-redux"
import { loginWith } from "../service/auth"
import { setUser } from "../reducer/userReducer"
import { setCommunityId, clearCommunityId } from "../reducer/communityIdReducer"
import { useNavigate } from "react-router"


const Login = () => {
  
  const userLoggedIn = useSelector(state => state.user.accessToken)

  const communityId = useSelector(state => state.communityId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (userLoggedIn) {
    return null
  }
  
  const handleSignUp = (event) => {
    dispatch(setCommunityId(''))
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
    dispatch(setUser(userLogin))
    console.log('user login', userLogin)
    const userForLogin = {
      ...userLogin,
      communityId
    }
   
    try {
     const loggedUser = await loginWith(userForLogin)
     console.log('logged in user', loggedUser)
     dispatch(setUser(loggedUser))
     reset(event)
     navigate('/')

   } catch (error) {
      console.log('invalid login', error.response.data.error)
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
        <CommunityOption />
        <form onSubmit={handleLogin}>
          username: <input name="loginUsername" type="text" autoComplete="currentLoginUsername" /><br />
          password: <input name="loginPassword" type="password" autoComplete="currentLoginPassword"/><br />
          <button type="submit">log in</button>
        </form>
        <p>Forgot password</p>
        <p>Don't have an account yet? <button onClick={handleSignUp}>Sign up</button></p>
      </div>
    
    
  )
}

export default Login

// Add in a show pasword feature