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

    const forPasswordReset = {
      username,
      newPassword: password,
      securityAnswer,
      securityQuestion: securityQ
    }

    console.log('reset info', forPasswordReset)

    try {
      const response = await resetPassword(forPasswordReset)
      console.log('PW reset response', response)
      dispatch(notifyConfirmation("You've reset your password successfully. Log in again to continue.", 6))
      navigate('/login')
    } catch (error) {
      console.log('error resetting password', error, error.response.data.error)
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
    <div>
      <h2>Password reset</h2>
      <Error />
      <form onSubmit={handlePasswordReset}>
        username: <input type="text" name="username" autoComplete="current-username" value={username} onChange={({ target }) => setUsername(target.value)} /><br/>
        new password: <input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" value={password} onChange={({ target }) => setPassword(target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide password" : "Show password"}</button><br />
        account security question: <select name="securityQuestion" value={securityQ} onChange={handleSecurityQuestion}>
          <option value=''>Select a security question</option>
          {securityQuestions.map(q => 
          <option key={q.question} value={q.question}>{q.name}</option>
          )}
        </select><br />
        Your answer to security question: <input type="text" name="securityAnswer" value={securityAnswer} onChange={({ target }) => setSecurityAnswer(target.value)} />
        <br />

        <button type="submit">reset password</button>
      </form>     
      <button onClick={handleCancel}>cancel</button>
      
    </div>
  )

}

export default PasswordReset