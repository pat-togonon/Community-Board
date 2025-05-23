const User = require('../models/User')
const Post = require('../models/Post')
const Community = require('../models/Community')
const bcrypt = require('bcrypt')


const addToFavorites = async (request, response) => {
  const { postId } = request.body //validate via zod

  const post = await Post.findById(postId)

  if (!post) {
    return response.status(400).json({ error: 'Invalid post' })
  }

  const isPostInsideUserCommunity = request.user.community.includes(post.community)

  if (!isPostInsideUserCommunity) {
    return response.status(400).json({ error: "Sorry! Can't add posts outside of your community to your favorites" })
  }

  if (request.user.favoritePosts.includes(post._id)) {
    return response.status(200).json({ message: 'Already favorited'})
  }

  request.user.favoritePosts = request.user.favoritePosts.concat(post._id)
  
  const savedUser = await request.user.save()
  console.log('favorites', savedUser.favoritePosts)
  return response.json(savedUser)

}

const viewAllFavoritePosts = async (request, response) => {
  const { communityId } = request.params

  console.log('comm id', communityId)

  const communityValid = await Community.findById(communityId)

  const isUserInThisCommunity = communityValid.communityUsers.includes(request.user._id)

  if (!communityValid || !isUserInThisCommunity) {
    return response.status(400).json({ error: 'Invalid community' })
  }

  const favoritePosts = request.user.favoritePosts

  return response.json(favoritePosts)

}

const removeFromFavorites = async (request, response) => {

  const { postId } = request.params //zod validate

  console.log('post id', postId)

  console.log('request user favorites', request.user.favoritePosts)

  const favoritedPostId = request.user.favoritePosts.find(fave => fave.toString() === postId)

  if (!favoritedPostId) {
    return response.status(204).end()
  }

  const actualFavoritedPost = await Post.findById(favoritedPostId)

  console.log('favorited post', favoritedPostId)
  console.log('actual fave post', actualFavoritedPost)

  console.log('request user communities', request.user.community)

  const isFavoritedPostInsideUserCommunity = request.user.community.filter(community => community.toString() === actualFavoritedPost.community.toString())

  console.log('is fave in user comm?', isFavoritedPostInsideUserCommunity)

  if (!actualFavoritedPost) {
    return response.status(204).end()
  }

  if (!isFavoritedPostInsideUserCommunity) {
    return response.status(401).json({ error: "Cannot remove favorite posts outside of your community" })
  }

  request.user.favoritePosts = request.user.favoritePosts.filter(post => post.toString() !== favoritedPostId.toString())

  await request.user.save()

  return response.status(204).end()

}

const updateName = async (request, response) => {
  const { name } = request.body // validate via zod
  const { userId } = request.params

  console.log('name', name)

  const isUserTheRequester = request.user._id.toString() === userId

  if (!isUserTheRequester) {
    return request.status(403).json({ error: "Forbidden: Can't update account you don't own" })
  }

  const updatedUser = await User.findOneAndUpdate(request.user._id, { name }, { new: true }, { runValidators: true })

  return response.status(200).json(updatedUser.name)

}

const deleteAccount = async (request, response) => {
  const { userId } = request.params

  console.log('user id', userId)
  const isUserTheRequester = request.user._id.toString() === userId
  console.log('is user the requester', isUserTheRequester)
  
  if (!isUserTheRequester) {
    return response.status(403).json({ error: "Forbidden: Can't delete account you don't own" })
  }

  const isRequesterAnAdmin = request.user.isAdmin
  console.log('an admin?', isRequesterAnAdmin)
  
  if (isRequesterAnAdmin) {
    return response.status(403).json({ error: "We see you're an admin. Please contact the webmaster to request deletion of your account" })
  }

  await Community.updateMany(
    { communityUsers: request.user._id },
    { $pull: {
      communityUsers: request.user._id
    }}
  )

  await Post.updateMany(
    { author: request.user._id },
    { $pull: {}}
  )
  const deletedAccount = await User.findByIdAndDelete(request.user._id)

  if (!deletedAccount) {
    return response.status(404).json({ error: 'User not found or already deleted' })
  }
  return response.status(204).end()

}

const updatePassword = async (request, response) => {
  const { password } = request.body // validate via zod

  const saltRounds = 10

}

module.exports = {
  addToFavorites,
  viewAllFavoritePosts,
  removeFromFavorites,
  updateName,
  deleteAccount
}