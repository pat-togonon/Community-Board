const { viewAll, viewOnePost, createPost, deletePost, editPost } = require('../controllers/posts')
const postRouter = require('express').Router()

postRouter.get('/:communityId/:mainCategory', viewAll)
postRouter.get('/:communityId/:mainCategory/:subCategory/:postId', viewOnePost)
postRouter.post('/:communityId/:mainCategory/:subCategory', createPost)
postRouter.delete('/:communityId/:mainCategory/:subCategory/:id', deletePost)
postRouter.put('/:communityId/:mainCategory/:subCategory/:id', editPost)


module.exports = postRouter


