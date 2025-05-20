import api from './api'

export const viewAllComments = async (communityId, mainCategory, subCategory, postId) => {
  const response = await api.get(`/posts/${communityId}/${mainCategory}/${subCategory}/${postId}/comments`)
  return response.data
}

export const postComment = async (communityId, mainCategory, subCategory, postId, newComment) => {
  const response = await api.post(`/posts/${communityId}/${mainCategory}/${subCategory}/${postId}/comments`, newComment)
  return response.data
}

export const viewAllCommunityComments = async (communityId) => {
  const response = await api.get(`/posts/${communityId}/comments/all`)
  return response.data
}
