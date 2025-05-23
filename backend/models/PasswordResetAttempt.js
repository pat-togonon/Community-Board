const mongoose = require('mongoose')

const passwordResetAttemptSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

passwordResetAttemptSchema.index({ timestamp: 1}, { expireAfterSeconds: 24 * 60 * 60 }) // expires in 24 hrs

const PasswordResetAttempt = mongoose.model('PasswordResetAttempt', passwordResetAttemptSchema)

module.exports = PasswordResetAttempt