const { z } = require('zod')

const addToFavoritesSchema = z.object({
  postId: z.string().trim().min(24, 'Post ID is required.')
}).strict()


const updateNameSchema = z.object({
  name: z.string().trim().min(3, 'Names must have at least 3 characters')
}).strict()


module.exports = { 
  addToFavoritesSchema,
  updateNameSchema
}