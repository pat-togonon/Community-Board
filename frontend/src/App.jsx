import Login from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from './components/dashboard'
import { useEffect } from 'react'
import { setUser, setNewAccessToken, logout } from './reducer/userReducer'
import api from './service/api'

const App = () => {
  console.log('Good morning Pat!')
  
  const dispatch = useDispatch()

  const userToken = useSelector(state => state.user.accessToken)
  const isUserLoggedIn = userToken ? true : false
  
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





  return (
    <div>
      <h1>KOMI logo</h1>
      {isUserLoggedIn ? <Dashboard /> : <Login />}
    </div>
  )
}

export default App