import { useNavigate } from "react-router"
const Homepage = () => {

  const navigate = useNavigate()

  const handleLogin = (event) => {
    navigate('/login')  
  }

  return (
    <div>
      <h1>Connect with your local community</h1>
      <button onClick={handleLogin} className="loginHomepage button">Login or sign up today</button>
  
    </div>
  )
}

export default Homepage