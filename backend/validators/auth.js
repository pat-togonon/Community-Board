const { z } = require('zod')

//sign up

const userRegistrationSchema = z.object({
  username: z.string().trim().min(5, 'Username is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  communityId: z.string().trim().min(24, 'Community you want to be part of is required'),
  birthYear: z.number().min(4, 'Birth year is required'),
  chosenSecurityQuestion: z.string().trim().min(1, 'Security question is required'),
  securityAnswer: z.string().trim().min(2, 'Answers should have at least 2 characters')
}).strict()

// login
const loginSchema = z.object({
  username: z.string().trim().min(5, 'Username is required'),
  password: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  communityId: z.string().trim().min(1, 'The community you are part of is required')
}).strict()

// update password
const updatePasswordSchema = z.object({
  oldPassword: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  newPassword: z.string().trim().min(5, 'Password length should be at least 5 characters')
}).strict()

const passwordResetSchema = z.object({
  username: z.string().trim().min(5, 'Username is required'),
  newPassword: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  securityQuestion: z.string().trim().min(1, 'Security question is required'),
  securityAnswer: z.string().trim().min(2, 'Answers should have at least 2 characters')
}).strict()


module.exports = { 
  userRegistrationSchema,
  loginSchema,
  updatePasswordSchema,
  passwordResetSchema
}