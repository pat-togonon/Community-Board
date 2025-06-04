const User = require('../models/User')
const Post = require('../models/Post')
const Community = require('../models/Community')
const { addToFavoritesSchema, updateNameSchema } = require('../validators/user')


const addToFavorites = async (request, response) => {
  
  const parsedData = addToFavoritesSchema.parse(request.body)
  const { postId } = parsedData

  const post = await Post.findOne({
    _id: postId,
    community: { $in: [request.user.community]},
  })

  if (!post) {
    return response.status(400).json({ error: 'Invalid post' })
  }

  if (request.user.favoritePosts.includes(post._id)) {
    return response.status(200).json({ message: 'Already favorited!'})
  }

  request.user.favoritePosts = request.user.favoritePosts.concat(post._id)
  
  const savedUser = await request.user.save()

  return response.json(savedUser)
}

const viewAllFavoritePosts = async (request, response) => {
  const { communityId } = request.params

  const communityValid = await Community.findOne({
    _id: communityId,
    communityUsers: { $in: [request.user._id] }
  })

  if (!communityValid) {
    return response.status(403).json({ error: "Community or user is not found. Can't view favorites." })
  }

  const favoritePosts = request.user.favoritePosts

  return response.json(favoritePosts)
}

const removeFromFavorites = async (request, response) => {

  const { postId } = request.params

  const favoritedPostId = request.user.favoritePosts.find(fave => fave.toString() === postId)

  if (!favoritedPostId) {
    return response.status(204).end()
  }

  const actualFavoritedPost = await Post.findOne({
    _id: favoritedPostId,
    community: { $in: [request.user.community]}
  })

  if (!actualFavoritedPost) {
    return response.status(204).end()
  }

  request.user.favoritePosts = request.user.favoritePosts.filter(post => post.toString() !== favoritedPostId.toString())

  await request.user.save()

  return response.status(204).end()
}

const updateName = async (request, response) => {
  const parsedData = updateNameSchema.parse(request.body)
  const { name } = parsedData
  
  const { userId } = request.params

  const isUserTheRequester = request.user._id.toString() === userId

  if (!isUserTheRequester) {
    return request.status(403).json({ error: "Forbidden: Can't update account you don't own" })
  }

  const updatedUser = await User.findOneAndUpdate(request.user._id, { name }, { new: true }, { runValidators: true })

  return response.status(200).json(updatedUser.name)

}

const deleteAccount = async (request, response) => {
  const { userId } = request.params

  const isUserTheRequester = request.user._id.toString() === userId
    
  if (!isUserTheRequester) {
    return response.status(403).json({ error: "Forbidden: Can't delete account you don't own" })
  }

  const isRequesterAnAdmin = request.user.isAdmin
  
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
    { $set: { author: null } }
  )
  const deletedAccount = await User.findByIdAndDelete(request.user._id)

  if (!deletedAccount) {
    return response.status(410).json({ error: 'User not found or already deleted' })
  }

  return response.status(204).end()

}


module.exports = {
  addToFavorites,
  viewAllFavoritePosts,
  removeFromFavorites,
  updateName,
  deleteAccount
}