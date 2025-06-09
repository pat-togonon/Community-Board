const commentRouter = require('express').Router()
const { viewAll, viewAllPostComments, postComment, editComment, deleteComment } = require('../controllers/comments')

commentRouter.get('/:communityId/comments/all', viewAll)
commentRouter.get('/:communityId/:mainCategory/:subCategory/:postId/comments', viewAllPostComments)
commentRouter.post('/:communityId/:mainCategory/:subCategory/:postId/comments', postComment)
commentRouter.put('/comment/:commentId', editComment)
commentRouter.delete('/comment/:commentId', deleteComment)


module.exports = commentRouter

