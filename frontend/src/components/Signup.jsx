
const SignUp = ({handleLogin}) => {
  

  return (
    <div>
      <h2>Create your account to connect with your local community</h2>
      <form>
        local community: <select></select><br />
        username: <input name="username" type="text" autoComplete="new-username"/><br />
        password: <input name="password" type="password" autoComplete="new-password" /><br />
        <button type="submit">sign up</button>
      </form>
        <div>
          <br />
          Already have an account? <button onClick={handleLogin}>login</button>
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