import axios from "axios"

const baseUrl = 'http://localhost:3001/api/users'

export const createAccountWith = async (newUser) => {
  const response = await axios.post(baseUrl, newUser)
  return response.data
}