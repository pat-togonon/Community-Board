import Login from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from './components/dashboard'
import { useEffect } from 'react'
import { setUser, setNewAccessToken, logout } from './reducer/userReducer'
import api from './service/api'
import LogOut from './components/Logout'



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
          dispatch(setUser(response.data.userFrontend))
          dispatch(setNewAccessToken(response.data.accessToken))
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
    <div>
      <h1>KOMI logo</h1>
      <LogOut />
      <Login />
      <Dashboard />
    </div>
  )
}

export default App