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
  name: String,
  passwordHash: String,
  birthYear: {
    type: Number, //check if I can design year drop down on frontend. Update here if can
    trim: true
  },
  email: {
    type: String,
    require: [true, 'Please enter your email'],
    unique: [true, 'email is already in use'],
    trim: true,
   // match: [/^[a-zA-Z0-9._%+-]+@?(?:[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/, 'invalid email'] //recheck regex ah
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
  isAdmin: {
    type: Boolean,
    default: false
  },
  isCommunityAdmin: {
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
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User