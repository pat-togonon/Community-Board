import { securityQuestions } from "../helper/helpers"
import { useState } from "react"
import { resetPassword } from "../service/auth"
import { useNavigate } from "react-router"

const PasswordReset = () => {

  const [securityQ, setSecurityQ] = useState('')

  const navigate = useNavigate()

  const handleSecurityQuestion = (event) => {
    const selectedQ = event.target.value
    setSecurityQ(selectedQ)
  }

  const handlePasswordReset = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const newPassword = event.target.password.value
    const securityAnswer = event.target.securityAnswer.value

    const forPasswordReset = {
      username,
      newPassword,
      securityAnswer,
      securityQuestion: securityQ
    }

    console.log('reset info', forPasswordReset)

    try {
      const response = await resetPassword(forPasswordReset)
      console.log('PW reset response', response)
      navigate('/login')
    } catch (error) {
      console.log('error resetting password', error, error.response.data.error)
    }
    clearForm(event)
  }

  const clearForm = (event) => {
    event.target.username.value = ''
    event.target.password.value = ''
    event.target.securityAnswer.value = ''
    setSecurityQ('')

  }
  return (
    <div>
      <h2>Password reset</h2>
      <form onSubmit={handlePasswordReset}>
        username: <input type="text" name="username" /><br/>
        new password: <input type="password" name="password" /><br />
        account security question: <select name="securityQuestion" value={securityQ} onChange={handleSecurityQuestion}>
          <option value=''>Select a security question</option>
          {securityQuestions.map(q => 
          <option key={q.question} value={q.question}>{q.name}</option>
          )}
        </select><br />
        Your answer to security question: <input type="text" name="securityAnswer" />
        <br />

        <button type="submit">reset password</button>
      </form>
    </div>
  )

}

export default PasswordReset