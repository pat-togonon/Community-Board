const commentRouter = require('express').Router()
const { viewAllComments, postComment } = require('../controllers/comments')

commentRouter.get('/:communityId/:mainCategory/:subCategory/:postId/comments', viewAllComments)
commentRouter.post('/:communityId/:mainCategory/:subCategory/:postId/comments', postComment)


module.exports = commentRouter