import footerCopy from "../helper/footerCopy"
import { useNavigate } from "react-router-dom"

const Footer = () => {

  const navigate = useNavigate()

  const handleReturnHome = () => {
    if (location.pathname === '/') {
      if (window.location.hash) {
        history.replaceState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })          
    } else {
      navigate('/')
    }
  }
  
  return (
    <div className="footer-div">
      <div className="footer-content">
        <img src="/logo1.png" onClick={handleReturnHome} />
        <div>
          <h3>About Komi</h3>
          <p>{footerCopy.mission.sub1}</p>
          <p>{footerCopy.mission.sub2}</p>
          <p>{footerCopy.mission.sub3}</p>
        </div>      
      </div>
    </div>
  )
}


export default Footer