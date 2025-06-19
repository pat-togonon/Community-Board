import { useNavigate } from "react-router-dom"

const ErrorRoutes = () => {

  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
  }

  return (
    <div>
      <h2>Oops! Invalid URL...</h2>
      <button onClick={handleHome} className="error-route-button button">Return home →</button>
      
    </div>
  )
}

export default ErrorRoutes