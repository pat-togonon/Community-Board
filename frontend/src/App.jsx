import Login from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from './components/dashboard'
import { useEffect } from 'react'
import { setUser, setNewAccessToken, logout } from './reducer/userReducer'
import api from './service/api'
import LogOut from './components/Logout'
import { setCommunityId } from './reducer/communityIdReducer'
import { Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage'
import SignUp from './components/Signup'
import MainCategoryRouter from './components/MainCategoryRouter'
import HomeFeed from './components/HomeFeed'
import PostPage from './components/PostPage'
import PostForm from './components/PostForm'

const App = () => {
  console.log('Good morning Pat!')
  
  const dispatch = useDispatch()

  const userToken = useSelector(state => state.user.accessToken)
  

  // brings in new access token so user stays logged in even when they refresh the browser
  
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await api.post('auth/refresh')

        if (response.status === 200 && response.data.accessToken) {
          console.log('refresh user is', response.data.userFrontend)
          dispatch(setUser(response.data.userFrontend))
          dispatch(setNewAccessToken(response.data.accessToken))
          dispatch(setCommunityId(response.data.userFrontend.community[0]))
        } 
      } catch (error) {
        console.log('error refreshing token', error)
        dispatch(logout())
      }
    }
    if (!userToken) {
      silentRefresh()
    }
  }, [userToken])

  const isUserLoggedIn = userToken ? true : false
  console.log(isUserLoggedIn)

  
  return (
    <>
      <h1>KOMI logo</h1>
      <LogOut />
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
        
      </Routes>
    </>
  )
}

export default App