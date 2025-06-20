import { securityQuestions } from "../helper/helpers"
import { useState } from "react"
import { resetPassword } from "../service/auth"
import { useNavigate } from "react-router"
import { notifyError } from "../reducer/errorReducer"
import { useDispatch } from "react-redux"
import Error from "./Notifications/Error"
import { notifyConfirmation } from "../reducer/confirmationReducer"

const PasswordReset = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [securityQ, setSecurityQ] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSecurityQuestion = (event) => {
    const selectedQ = event.target.value
    setSecurityQ(selectedQ)
  }

  const handlePasswordReset = async (event) => {
    event.preventDefault()

    if (!username || !password || !securityAnswer || !securityQ) {
      dispatch(notifyError("Please fill in all fields.", 5))
      return
    }    

    const forPasswordReset = {
      username,
      newPassword: password,
      securityAnswer,
      securityQuestion: securityQ
    }

    try {
      const _response = await resetPassword(forPasswordReset)
      dispatch(notifyConfirmation("You've reset your password successfully. Log in again to continue.", 6))
      navigate('/login')
    } catch (error) {
      dispatch(notifyError(`${error.response.data.error}.`, 7))
    }
    clearForm()
  }

  const clearForm = () => {
    setUsername('')
    setPassword('')
    setSecurityAnswer('')
    setSecurityQ('')

  }

  const handleCancel = () => {
    clearForm()
    navigate('/')
  }

  return (
    <div className="loginContainer">
      <h2 className="loginContainerChild loginHeader">Reset your password</h2>
      <form onSubmit={handlePasswordReset} className="loginContainerChild">
      <label htmlFor="username" className="loginContainerChild">
        username: <span className='required'>*</span></label>
        <input type="text" name="username" autoComplete="username" value={username} onChange={({ target }) => setUsername(target.value)} className="loginContainerChild" id="username-pw-reset" placeholder="enter your username" />

        <label htmlFor="password" className="loginContainerChild passwordLabel">
        new password: <span className='required'>*</span></label>        
        <div className="loginContainerChild password">
          <input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" id="password-pw-reset" className="loginContainerChild passwordField" placeholder="enter your password" value={password} onChange={({ target }) => setPassword(target.value)} />
          <img role="show and hide password button" src={showPassword ? './eye.svg' : './eye-off.svg'} onClick={() => setShowPassword(!showPassword)} className="eye"/>
        </div>

        <label htmlFor="securityQuestion" className="loginContainerChild">
          account security question:<span className='required'>*</span></label>
          <select name="securityQuestion" value={securityQ} onChange={handleSecurityQuestion} className="loginContainerChild" id="securityQuestion" required>
          <option value='' disabled>Select a security question</option>
          {securityQuestions.map(q => 
          <option key={q.question} value={q.question}>{q.name}</option>
          )}
        </select>

        <label htmlFor="securityAnswer" className="loginContainerChild">
        Your answer to security question:<span className='required'>*</span></label>
        <input type="text" name="securityAnswer" value={securityAnswer} onChange={({ target }) => setSecurityAnswer(target.value)} className="loginContainerChild" id="securityAnswer" placeholder="enter your answer" />

        <button type="submit" className="loginContainerChild loginButton" id='pw-reset-button'>reset password</button>
      </form>     
      <Error />
      <p role="button" onClick={handleCancel} className="loginContainerChild forSignUp textLink">cancel</p>
    </div>
  )

}

export default PasswordReset