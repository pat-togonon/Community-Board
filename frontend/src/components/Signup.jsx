import CommunityOption from "./CommunityOption"
import { createAccountWith } from "../service/auth"
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "../reducer/userReducer"
import { useNavigate } from "react-router-dom"
import { securityQuestions } from "../helper/helpers"
import { useEffect, useState } from "react"
import { clearCommunityId } from "../reducer/communityIdReducer"
import { notifyError } from "../reducer/errorReducer"
import Error from './Notifications/Error'
import { notifyConfirmation } from "../reducer/confirmationReducer"

const SignUp = () => {

  const [securityQ, setSecurityQ] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const communityId = useSelector(state => state.communityId)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(clearCommunityId())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' }) 
  }, [])
  
  const handleSignUp = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const email = event.target.email.value
    const password = event.target.password.value
    const birthYear = event.target.birthYear.value
    const chosenSecurityQuestion = securityQ
    const securityAnswer = event.target.securityAnswer.value

    if (!username || !password || !email || !birthYear || !securityAnswer || !chosenSecurityQuestion) {
      dispatch(notifyError("Please fill in all fields.", 3))
      return
    }  
    
    const newUser = {
      username,
      password,
      email,
      communityId,
      birthYear,
      chosenSecurityQuestion,
      securityAnswer
    }

    try {
      const createdUser = await createAccountWith(newUser)
      dispatch(setUser(createdUser))
      dispatch(notifyConfirmation("You've signed up successfully. Log in to continue.", 6))
      reset(event)
      navigate('/login')

    } catch (_error) {
      dispatch(notifyError('Please fill out all fields.', 3))
      reset(event)
    }
  }
  
  const reset = (event) => {
    event.target.username.value = ''
    event.target.password.value = ''
    event.target.email.value = ''
    event.target.birthYear.value = ''
    event.target.securityAnswer.value = ''
    dispatch(clearCommunityId())
    setSecurityQ('')
  }

  const showLogin = () => {
    navigate('/login')
  }

  const handleSecurityQuestion = (event) => {
    const selectedQ = event.target.value
    setSecurityQ(selectedQ)
  
  }

  return (
    <div className="loginContainer">
      <h2 className="loginContainerChild loginHeader">Create your account to connect with your local community</h2>
      <p className="loginContainerChild ageNote">You should be at least 13 years old to join in.</p>
      <CommunityOption />
      <form onSubmit={handleSignUp} className="loginContainerChild">

        <label htmlFor="username" className="loginContainerChild">
        username:<span className='required'>*</span></label>
        <input name="username" type="text" autoComplete="new-username" className="loginContainerChild" id="username-for-signup" placeholder="enter your username" />

        <label htmlFor="email" className="loginContainerChild">
        email:<span className='required'>*</span></label>
        <input name="email" type="email" autoComplete="email" className="loginContainerChild" id="email-for-signup" placeholder="enter your email address"/>

        <label htmlFor="password" className="loginContainerChild passwordLabel">
        password: <span className='required'>*</span></label>

        <div className="loginContainerChild password">
            <input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" className="loginContainerChild passwordField" placeholder="enter your password" id="password-for-signup" />
            <img role="show and hide password button" src={showPassword ? './eye.svg' : './eye-off.svg'} onClick={() => setShowPassword(!showPassword)} className="eye"/>
        </div>
        
        <label htmlFor="birthYear" className="loginContainerChild">
        Year of birth:<span className='required'>*</span></label>
        <input type="number" name="birthYear" placeholder="YYYY" autoComplete="bday-year" className="loginContainerChild" id="birthYear"/>

        <label htmlFor="security-question" className="loginContainerChild">
        Choose one security question:<span className='required'>*</span></label>
        <select value={securityQ} name="securityQuestion" onChange={handleSecurityQuestion} className="loginContainerChild" id="security-question" required>
          <option value='' disabled>Select a security question</option>
          {securityQuestions.map(q => 
          <option key={q.question} value={q.question}>{q.name}</option>
          )}
        </select>

        <label htmlFor="security-answer" className="loginContainerChild">
        Your answer to security question:<span className='required'>*</span></label>
        <input type="text" name="securityAnswer" className="loginContainerChild" id="security-answer" placeholder="enter your answer" />    
        <button type="submit" className="loginContainerChild loginButton" id="signup-button">Sign up</button>
      </form>
      <Error />
        <div className="loginContainerChild">
          <p className="loginContainerChild forSignUp">Already have an account? <span onClick={showLogin} className="textLink">Log in</span></p>          
        </div>
    </div>
  )
}

export default SignUp