import Login from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from './components/dashboard'
import { useEffect, useState } from 'react'
import { setUser, setNewAccessToken, logout } from './reducer/userReducer'
import api from './service/api'
import { setCommunityId } from './reducer/communityIdReducer'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Homepage from './components/Homepage'
import SignUp from './components/Signup'
import MainCategoryRouter from './components/MainCategoryRouter'
import HomeFeed from './components/HomeFeed'
import PostPage from './components/PostPage'
import PostForm from './components/PostForm'
import Account from './components/Account'
import { clearMainCategory } from './reducer/mainCategoryReducer'
import { resetSubCategory } from './reducer/subCategoryReducer'
import Profile from './components/Profile'
import Settings from './components/Settings'
import PasswordReset from './components/PasswordReset'

const App = () => {
  console.log('Good morning Pat!')
  const [hideHome, setHideHome] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userToken = useSelector(state => state.user.accessToken)
  const loggedInUser = useSelector(state => state.user)
  const isLoggedIn = loggedInUser.isLoggedIn
  console.log('is logged in?', isLoggedIn)

  // brings in new access token so user stays logged in even when they refresh the browser
  
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await api.post('auth/refresh')

        if (response.status === 200 && response.data.accessToken) {
          console.log('refresh user is', response.data.userFrontend)
          dispatch(setUser(response.data.userFrontend))
          dispatch(setNewAccessToken(response.data.accessToken))
          dispatch(setCommunityId(response.data.userFrontend.community))
        } 
      } catch (error) {
        console.log('error refreshing token', error)
        dispatch(logout())
      }
    }
    if (!userToken && !isLoggedIn) {
      silentRefresh()
    }
  }, [userToken, isLoggedIn])

  const isUserLoggedIn = userToken ? true : false
  console.log(isUserLoggedIn)

  // fetch the posts so they stay even when browser is refreshed

  const communityHeader = () => {

    if (!isUserLoggedIn) {
      return null
    }

    return <h3>The {loggedInUser.communityName} Community</h3>
  }
  
  const homeStyle = {
    display: hideHome ? 'none' : ''
  }

  const handleReturnHome = () => {
    dispatch(clearMainCategory())
    dispatch(resetSubCategory())
    navigate('/')
  }

  console.log('loggedInUser', loggedInUser, 'id', loggedInUser.id)

  return (
    <>
      <div onClick={handleReturnHome}><h1>KOMI logo</h1></div>
      {communityHeader()}
      {isUserLoggedIn ? <button style={homeStyle} onClick={() => setHideHome(!hideHome)}>Account</button> : '' }
      {hideHome ? <div onClick={() => setHideHome(!hideHome)}><Account /></div> : ''}
      <div style={homeStyle}>
      <Routes>
        <Route path='/' element={userToken ? <Dashboard /> : <Homepage />} >
          <Route index element={<HomeFeed />} />
          <Route path='posts/:community/:mainCategory' element={<MainCategoryRouter />} />
          <Route path='posts/:community/:mainCategory/:subCategory' element={<MainCategoryRouter />} />
          
        </Route>
        
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />      
        <Route path='/posts/:community/:mainCategory/new-post' element={<PostForm />} />
        <Route path='/posts/:community/:mainCategory/:subCategory/:id' element={<PostPage />} />
        <Route path='/user/profile/*' element={<Profile />} />
        <Route path='/user/settings' element={<Settings />} />
        <Route path='/password-reset' element={<PasswordReset />} />
        
        
      </Routes>
      </div>
    </>
  )
}

// add Route for error page - for all invalid links
export default App