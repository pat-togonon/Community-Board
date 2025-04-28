const mongoose = require('mongoose')

postSchema = mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true  
  }, 
  mainCategory: {
    type: String,
    enum: ['event', 'announcement', 'lost_and_found', 'business_promotion', 'garage_sale_and_giveaways'],
    required: true
  },
  subCategory: String,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  comments: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
    }
  ],
}, { timestamps: true })

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post