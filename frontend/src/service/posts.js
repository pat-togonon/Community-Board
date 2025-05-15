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