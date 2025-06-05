const { z } = require('zod')

const communityRegistrationSchema = z.object({
  username: z.string().trim().min(5, 'Username is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().min(5, 'Password length should be at least 5 characters'),
  communityName: z.string().trim().min(5, 'Community name is required'),
  communityDescription: z.string().trim().min(15, 'Community description is required'),
  chosenSecurityQuestion: z.string().trim().min(1, 'Security question is required'),
  securityAnswer: z.string().trim().min(2, 'Answers should have at least 2 characters'),
  birthYear: z.number().min(4, 'Birth year is required')
}).strict()

module.exports = {
  communityRegistrationSchema
}