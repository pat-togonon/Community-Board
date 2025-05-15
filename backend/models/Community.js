const mongoose = require('mongoose')

const communitySchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [5, 'community name must be at least 5 characters long'],
    required: [true, 'please create a community name'],
    unique: [true, 'community name already exists']
  },
  description: {
    type: String,
    minLength: [15, 'please describe this community in at least 15 characters'],
    required: [true, 'please describe this community']    
  },
  admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      //required: true
  },
  additionalAdmins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  isApproved: {
    type: Boolean,
    default: false
  },
  communityUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true })

communitySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id,
    delete returnedObject.__v
  }
})

const Community = mongoose.model('Community', communitySchema)

module.exports = Community