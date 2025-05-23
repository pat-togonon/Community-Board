import api from "./api"

export const updateSavedName = async (userId, name) => {
  const response = await api.put(`/user/settings/${userId}`, { name })
  return response.data
}

export const deleteAccount = async (userId) => {
  const response = await api.delete(`/user/settings/${userId}`)
  return response.data
}