import api from "./api"

export const viewAll = async (communityId, category) => {
  const response = await api.post(`/posts/${communityId}/${category}`)
  return response.data
}
