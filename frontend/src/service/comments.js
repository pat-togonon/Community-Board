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

export const updateComment = async (commentId, comment) => {
  const response = await api.put(`posts/comment/${commentId}`, comment)
  return response.data
}

export const deleteComment = async (commentId) => {
  const response = await api.delete(`posts/comment/${commentId}`)
  return response.data
}
