import api from './api'

// list of approved / active communities

export const getCommunities = async () => {
  const response = await api.get('/communities')
  return response.data
}

export const getCurrentCommunity = async (communityId) => {
  const response = await api.get(`/communities/${communityId}`)
  return response.data
}

export const registerCommunity = async (newCommunity) => {
  const response = await api.post('/communities', newCommunity)
  return response.data
}