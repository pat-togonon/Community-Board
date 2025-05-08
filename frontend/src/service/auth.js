//sign up, login and for refresh (but no logic yet)
import api from "./api"

//for signing up

export const createAccountWith = async (newUser) => {
  const response = await api.post('/auth/users', newUser)
  return response.data
}

//for logging in

export const loginWith = async (user) => {
  const response = await api.post('/auth/login', user)
  return response.data

}

//for logging out

export const logoutUser = async () => {
  const response = await api.post('/auth/logout', {})
  return response.data
}