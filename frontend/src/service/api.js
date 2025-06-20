import axios from "axios"
import store from '../store'
import { setNewAccessToken, logout, setUser } from "../reducer/userReducer"


// interceptor to automatically include the cookie and token to backend every time we make a request

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  withCredentials: true // to send to backend the cookie
})

api.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken

  const isPublicUrl = ['/login', '/refresh', '/password-reset'].some(path => config.url.includes(path))

  if (token && !isPublicUrl) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => { 
    return response
  },


  async (error) => {
        
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    if (!isLoggedIn) {
      return Promise.reject(error)
    }

    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
      const response = await api.post('/auth/refresh') // I shortened this. Originally, it's full url, with 2nd argument {} and 3rd withCredentials
      
      const user = response.data.userFrontend
      store.dispatch(setUser(user))

      const newAccessToken = response.data.accessToken

      store.dispatch(setNewAccessToken(newAccessToken))

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return api(originalRequest)

    } catch (refreshTokenError) {
        store.dispatch(logout())
        return Promise.reject(refreshTokenError)
        
        // useNavigate to login page here Pat
        // and after logging in, how would they get redirected from the previous page they're viewing?
      }      
    }
    return Promise.reject(error)
  }
)

export default api