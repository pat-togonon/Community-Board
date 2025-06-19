import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { clearMainCategory } from "../reducer/mainCategoryReducer"
import { resetSubCategory } from "../reducer/subCategoryReducer"
import { useState, useEffect } from "react"
import { logoutUser } from "../service/auth"
import { logout } from "../reducer/userReducer"
import { clearCommunityId } from "../reducer/communityIdReducer"
import { clearComments } from "../reducer/commentsReducer";
import { clearFavoritePosts } from "../reducer/favoriteReducer";
import { clearPosts } from "../reducer/postReducer";
import logo from "/logo1.png?url"


const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('isLoggedIn')

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleReturnHome = () => {
      setIsMenuOpen(false)
      dispatch(clearMainCategory())
      dispatch(resetSubCategory())
      navigate('/')
    }

  const handleLogin = () => {
    setIsMenuOpen(!isMenuOpen)
    navigate('/login')
  }

  const menuBar = () => {
    if (isLoggedIn) {
      return null
    }

  const handleSignup = () => {
    setIsMenuOpen(!isMenuOpen)
    navigate('/signup')
  }

    return (
      <>
        <ul className="nav-list">
        <Link to='/' className="nav-link">
          <li className="nav-item" onClick={() => setIsMenuOpen(!isMenuOpen)}>Home</li>
        </Link>
          <li className="nav-item">About</li>
          <li className="nav-item">Features</li>
          <li className="nav-item nav-link" onClick={handleLogin}>Login</li>
          <li className="nav-item nav-link get-started" onClick={handleSignup}>Get Started</li>
        </ul>
      </>

    )
  }

  const handleProfile = () => {
    setIsMenuOpen(!isMenuOpen)
    navigate('/user/profile')    
  }
  
  const handleSettings = () => {
    setIsMenuOpen(!isMenuOpen)
    navigate('/user/settings')
  }

  const handleLogout = async (event) => {   
      setIsMenuOpen(!isMenuOpen)
      try {
      await logoutUser()
      // clear the redux store
      localStorage.removeItem('isLoggedIn')
      dispatch(logout())
      dispatch(clearCommunityId())
      dispatch(clearMainCategory())
      dispatch(resetSubCategory())
      dispatch(clearComments())
      dispatch(clearFavoritePosts())
      dispatch(clearPosts())
      navigate('/')
      
      } catch (error) {
        console.log('error log out', error.response.data.error)
      }
    }

  const accountMenu = () => {
    if (!isLoggedIn) {
      return null
    }

    return (
      <>
        <ul className="nav-list">
        <Link to='/' className="nav-link">
          <li className="nav-item" onClick={() => setIsMenuOpen(!isMenuOpen)}>Home</li>
        </Link>
          <li className="nav-item" onClick={handleProfile}>Profile</li>
          <li className="nav-item" onClick={handleSettings}>Account Settings</li>
          <li className="nav-item nav-link" onClick={handleLogout}>Logout</li>
        </ul>
      </>

    )

  }
  return (
    <header className="header">
      <div className="header-content">
      <div className="logo-container" onClick={handleReturnHome}>
        <img src={logo} alt="Komi website logo" className="logo"/>
        </div>

      <button className="hamburger-button" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation menu">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
        
      <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
        {menuBar()}
        {accountMenu()}
      </nav>
      </div>
    </header>
  )
}

export default Header