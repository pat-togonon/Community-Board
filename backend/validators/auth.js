const { z } = require('zod')

//sign up

const userRegistrationSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  communityId: z.string().trim().min(1, 'Community you want to be part of is required')
}).strict()

// login
const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  communityId: z.string().trim().min(1, 'The community you are part of is required')
}).strict()

module.exports = { 
  userRegistrationSchema,
  loginSchema
}

// need separate validators for post route for Post?