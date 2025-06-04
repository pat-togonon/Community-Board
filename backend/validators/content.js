const { z } = require('zod')

// const { communityId, mainCategory, subCategory, title, description, author, startDate, endDate, isFound  } = request.body

// posts and comments

const newPostSchema = z.object({
  communityId: z.string().trim().min(1, 'The community to post in is required'),
  mainCategory: z.string().trim().min(1, 'The main category for the post is required'),
  subCategory: z.string().trim().min(1, 'The sub category for the post is required'),
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(15, 'Description is required'),
  author: z.string().trim().min(1, 'Author is required'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
}).strict()
.refine(data => {
  if (!data.startDate || !data.endDate) {
    return true
  }
  return data.endDate >= data.startDate
}, {
  message: 'End date must be later than or same date as start date',
  path: ['endDate']
})

const editedPostSchema = z.object({
  description: z.string().trim().optional(),
  isFound: z.boolean().optional()
})

module.exports = {
  newPostSchema,
  editedPostSchema
}