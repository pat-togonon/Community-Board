import CommunityOption from "./CommunityOption"
import { createAccountWith } from "../service/auth"
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "../reducer/userReducer"
import { useNavigate } from "react-router-dom"
import { securityQuestions } from "../helper/helpers"
import { useState } from "react"
import { clearCommunityId } from "../reducer/communityIdReducer"

const SignUp = () => {

  const [securityQ, setSecurityQ] = useState('')

  const dispatch = useDispatch()
  const communityId = useSelector(state => state.communityId)
  const navigate = useNavigate()
  
  const handleSignUp = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const email = event.target.email.value
    const password = event.target.password.value
    const birthYear = event.target.birthYear.value
    const chosenSecurityQuestion = securityQ
    const securityAnswer = event.target.securityAnswer.value
    
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
      console.log('succesful', createdUser)
      reset(event)
      navigate('/login')
    
      // Add notification. Maybe modals too to confirm successful sign up. Example: Sign up succesful! Log in now to access your community - isSignUpSuccess = true

    } catch (error) {
      console.log('error', error.response.data.error)
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
    <div>
      <h2>Create your account to connect with your local community</h2>
      <CommunityOption />
      <form onSubmit={handleSignUp}>
        username: <input name="username" type="text" autoComplete="new-username"/><br />
        email: <input name="email" type="email" autoComplete="new-email" /><br />
        password: <input name="password" type="password" autoComplete="new-password" /><br />
        Year of birth: <input type="number" name="birthYear" placeholder="YYYY" /><br />
        Choose one security question: 
        <select value={securityQ} name="securityQuestion" onChange={handleSecurityQuestion}>
          <option value=''>Select a security question</option>
          {securityQuestions.map(q => 
          <option key={q.question} value={q.question}>{q.name}</option>
          )}
        </select><br />
        Your answer to security question: <input type="text" name="securityAnswer" />
        <br />

        <button type="submit">sign up</button>
      </form>
        <div>
          <br />
          Already have an account? <button onClick={showLogin}>login</button>
        </div>
    </div>
  )
}

export default SignUp

/*
Notes:

1. Instead of <br />, use CSS to make the label and input a block element
2. onChange on input fields and onSubmit for the form

*/