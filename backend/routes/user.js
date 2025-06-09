const userRouter = require("express").Router()
const { addToFavorites, viewAllFavoritePosts, removeFromFavorites, updateName, deleteAccount, viewAllUsers } = require('../controllers/user')

userRouter.put('/favorites', addToFavorites)
userRouter.get('/favorites/:communityId', viewAllFavoritePosts)
userRouter.delete('/favorites/:postId', removeFromFavorites)
userRouter.put('/settings/:userId', updateName)
userRouter.delete('/settings/:userId', deleteAccount)
userRouter.get('/:communityId/users/all', viewAllUsers)

module.exports = userRouter