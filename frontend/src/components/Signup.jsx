import CommunityOption from "./CommunityOption"
import { createAccountWith } from "../service/auth"
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "../reducer/userReducer"
import { useNavigate } from "react-router-dom"

const SignUp = () => {

  const dispatch = useDispatch()
  const communityId = useSelector(state => state.communityId)
  const navigate = useNavigate()
  
  const handleSignUp = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    const email = event.target.email.value

    const newUser = {
      username,
      password,
      email,
      communityId
    }
    try {
      const createdUser = await createAccountWith(newUser)
      dispatch(setUser(createdUser))
      console.log('succesful', createdUser)
      reset(event)
    
      // navigate to login page to log in

    } catch (error) {
      console.log('error', error.response.data.error)
      reset(event)
    }
  }
  
  const reset = (event) => {
    event.target.username.value = ''
    event.target.password.value = ''
    event.target.email.value = ''
  }

  const showLogin = () => {
    navigate('/login')
  }

  return (
    <div>
      <h2>Create your account to connect with your local community</h2>
      <CommunityOption />
      <form onSubmit={handleSignUp}>
        username: <input name="username" type="text" autoComplete="new-username"/><br />
        email: <input name="email" type="email" autoComplete="new-email" /><br />
        password: <input name="password" type="password" autoComplete="new-password" /><br />
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