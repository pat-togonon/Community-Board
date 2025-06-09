const { z } = require('zod')

const newCommentSchema = z.object({
  parentComment: z.string().nullable(),
  comment: z.string().min(3, "Comments must have at least 3 characters")
}).strict()


const editCommentSchema = z.object({
  comment: z.string().min(3, "Comments must have at least 3 characters")
}).strict()

module.exports = {
  newCommentSchema,
  editCommentSchema
}