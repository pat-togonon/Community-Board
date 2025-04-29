import axios from "axios"

const baseUrl = 'http://localhost:3001/api/login'

export const loginWith = async (user) => {
  const response = await axios.post(baseUrl, user)
  return response.data

}