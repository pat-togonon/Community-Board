const authRouter = require('express').Router()
const { createAccount, viewOneUser, login, getRefreshToken, usersList, logout } = require('../controllers/auth')
const middleware = require('../utils/middleware')

// user registration and details
authRouter.get('/users', usersList) // need to remove later on
authRouter.post('/users', createAccount)
authRouter.get('/users/:id', middleware.tokenExtractor, middleware.userExtractor, viewOneUser)

//user login
authRouter.post('/login', login)

// get refresh token
authRouter.post('/refresh', getRefreshToken)

//log out
authRouter.post('/logout', logout)

module.exports = authRouter
