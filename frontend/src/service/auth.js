// sign up, login and for refresh (but no logic yet)

import axios from "axios"
import api from "./api"

// for signing up
const signupUrl = 'http://localhost:3001/api/auth/users'

export const createAccountWith = async (newUser) => {
  const response = await axios.post(signupUrl, newUser)
  return response.data
}

//for logging in
const loginUrl = 'http://localhost:3001/api/auth/login'

export const loginWith = async (user) => {
  const response = await axios.post(loginUrl, user, { withCredentials: true })
  return response.data

}

