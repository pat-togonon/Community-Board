import api from './api'

export const viewAllComments = async (communityId, mainCategory, subCategory, postId) => {
  const response = await api.get(`/comments/${communityId}/${mainCategory}/${subCategory}/${postId}/all`)
  return response.data
}

export const postComment = async (communityId, mainCategory, subCategory, postId, newComment) => {
  const response = await api.post(`/comments/${communityId}/${mainCategory}/${subCategory}/${postId}/comment`, newComment)
  return response.data
}

export const viewAllCommunityComments = async (communityId) => {
  const response = await api.get(`/comments/${communityId}/all`)
  return response.data
}

export const updateComment = async (commentId, comment) => {
  const response = await api.put(`/comments/${commentId}`, comment)
  return response.data
}

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`)
  return response.data
}
