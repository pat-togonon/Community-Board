// view all posts OKs
// view one post Oks
// view all post in a subcategory OK
// edit or delete YOUR post ==> update need validators: true
// create posts 
const Post = require('../models/Post')
const User = require('../models/User')
const Community = require('../models/Community')
const { validSubcategories } = require('../utils/helper')

const viewAll = async (request, response) => {
  const { communityId, mainCategory } = request.params

  const isCommunityIdValid = await Community.findById(communityId)
  
  if (mainCategory === 'home') {
    const homeAllPosts = await Post.find({})
    console.log('home', mainCategory)
    return response.json(homeAllPosts)
  }

  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)

  if (!isCommunityIdValid || !isMainCategoryValid) {
    return response.status(404).json({ error: 'Oops! Invalid url' })
  }

  const allPosts = await Post.find({ 
    community: communityId,
    mainCategory
  })

  return response.json(allPosts.map(post => post.toJSON()))

}

const viewAllInSubCategory = async (request, response) => {
  const { communityId, mainCategory, subCategory } = request.params

  const isCommunityIdValid = await Community.findById(communityId)
  
  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)
  
  if (subCategory === 'All') {
    const posts = await Post.find({ mainCategory })
    return response.json(posts)
  }
  
  const isSubCategoryValid = validSubcategories[mainCategory].includes(subCategory)

  if (!isCommunityIdValid || !isMainCategoryValid || !isSubCategoryValid) {
    return response.status(404).json({ error: 'Yaa! Invalid url' })
  }

  const allPostsInCategory = await Post.find({
    mainCategory,
    subCategory
  })

  return response.json(allPostsInCategory)
}

const viewOnePost = async (request, response) => {
  const { communityId, mainCategory, subCategory, postId } = request.params

  const isCommunityIdValid = await Community.findById(communityId)
  
  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)

  const isSubCategoryValid = validSubcategories[mainCategory].includes(subCategory)

  const post = await Post.findById(postId)

  if (!isCommunityIdValid || !isMainCategoryValid || !isSubCategoryValid || !post) {
    return response.status(404).json({ error: 'Yaa! Invalid url' })
  }

  return response.json(post)

}

const createPost = async (request, response) => {
  const { communityId, mainCategory, subCategory, title, description, userId, startDate, endDate, isFound  } = request.body

  const commId = await Community.findById(communityId)

  if (!commId) {
    return response.status(404)
  }

  const post = new Post({
    community: communityId,
    mainCategory,
    subCategory,
    title,
    description,
    author: userId,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    comments: [],
    isFound: isFound
  })

  const savedPost = await post.save()

  const user = await User.findById(userId)

  user.createdPosts.push(savedPost._id)

  await user.save()

  return response.status(201).json(savedPost.toJSON())


}

module.exports = { viewAll, createPost, viewAllInSubCategory, viewOnePost }