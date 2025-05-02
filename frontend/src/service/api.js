import axios from "axios"
import store from '../store'
import { setNewAccessToken, logout } from "../reducer/userReducer"

// interceptor to automatically include the cookie and token to backend every time we make a request

const api = axios.create({
  baseURL: '/api',
  withCredentials: true // to send to backend the cookie
})

api.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken

  const isPublicUrl = ['/login', '/users', '/communities'].some(path => config.url.includes(path))

  if (token && !isPublicUrl) {
    config.headers.Authorization `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => { 
    return response
  },
  

  async (error) => {
    
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
      const response = await axios.post('http://localhost:3001/api/refresh', {}, {
        withCredentials: true
      })

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