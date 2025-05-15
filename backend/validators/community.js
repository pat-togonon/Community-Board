const { z } = require('zod')

const communityRegistrationSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  communityName: z.string().trim().min(1, 'Community name is required'),
  communityDescription: z.string().trim().min(1, 'Community description is required')
}).strict()

module.exports = {
  communityRegistrationSchema
}