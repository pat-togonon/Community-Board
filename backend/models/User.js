const mongoose = require('mongoose')
const emailValidator = require('validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: [5, 'username must have at least 5 characters'],
    trim: true,
    unique: [true, 'username unavailable'],
    require: [true, 'please input username']
  },
  name: {
    type: String,
    trim: true,
    minLength: [3, 'names must have at least 3 characters']
  },
  passwordHash: String,
  birthYear: {
    type: Number,
    require: [true, 'Birth year is required'],
    validate: {
      validator: function (v) {
      
      const currentYear = new Date().getFullYear()
      const minAge = 13
      const earliestAllowedYear = currentYear - minAge
      const maxAge = 120
      const userAge = currentYear - v
      
      const meetsAgeLimit = v <= earliestAllowedYear && userAge <= maxAge
      const notFutureYear = v <= currentYear
      
      return meetsAgeLimit && notFutureYear
    },
    message: 'You must be at least 13 years old or birth year is invalid'
    }
  },
  email: {
    type: String,
    require: [true, 'Please enter your email'],
    unique: [true, 'email is already in use'],
    trim: true,
    validate: {
      validator: emailValidator.isEmail,
      message: 'Invalid email address'
   }
  },
  community: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community'
    }
  ],
  securityQuestion: {
    type: String,
    enum: ['in-what-city-were-you-born', 'what-is-the-name-of-your-favorite-pet', 'what-is-your-mother-maiden-name', 'what-high-school-did-you-attend', 'what-was-the-name-of-your-elementary-school', 'what-was-your-favorite-food-as-a-child', 'what-year-was-your-father-or-mother-born'],
    required: true,
    trim: true
  },
  securityAnswerHash: {
    type: String,
    trim: true,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  managedCommunity: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community'
    }],
  createdPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  favoritePosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ], 
}, { timestamps: true })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    delete returnedObject.securityAnswerHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User