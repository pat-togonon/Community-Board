import api from "./api"

export const createPost = async (newPost, communityId, mainCategory, subCategory) => {
  const response = await api.post(`/posts/${communityId}/${mainCategory}/${subCategory}`, newPost)
  return response.data
}

export const getAllPosts = async (communityId, mainCategory) => {
  const response = await api.get(`/posts/${communityId}/${mainCategory}`)
  return response.data
}

export const getSubCategoryPosts = async (communityId, mainCategory, subCategory) => {
  const response = await api.get(`/posts/${communityId}/${mainCategory}/${subCategory}`)
  return response.data
}

export const deletePost = async (communityId, mainCategory, subCategory, postId) => {

  const response = await api.delete(`/posts/${communityId}/${mainCategory}/${subCategory}/${postId}`)
  return response.data

}

export const editPost = async (communityId, mainCategory, subCategory, postId, editedPost) => {

  const response = await api.put(`/posts/${communityId}/${mainCategory}/${subCategory}/${postId}`, editedPost)

  return response.data
}