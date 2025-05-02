const refreshRouter = require('express').Router()
const jwt = require('jsonwebtoken')

require('dotenv').config()

refreshRouter.post('/', (request, response) => {
  const refreshToken = request.cookies.jwt

  if (!refreshToken) {
    return response.status(406).json({ error: 'Unauthorized' })
  }

  try {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
  
  const userForToken = {
    username: decoded.username,
    id: decoded.id
  }

   const accessToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, { expiresIn: '15m' })
   
   return response.json({ accessToken })

  } catch (error) {
    console.log('Refresh token verification failed:', error.message) // for debugging
    return response.status(406).json({ error: 'Unauthorized' })
  }
})

module.exports = refreshRouter