import axios from "axios"

const baseUrl = 'http://localhost:3001/api/communities'

export const getCommunities = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

