const mongoose = require('mongoose')
const { validSubcategories } = require('../utils/helper')

const postSchema = mongoose.Schema({
  community: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true  
  }, 
  mainCategory: {
    type: String,
    enum: ['upcoming-event', 'announcement', 'lost-and-found', 'shops-promotion', 'garage-sale-and-giveaways'],
    required: true
  },
  subCategory: {
    type: String,
    validate: {
      validator: function(v) {
        const mainCategory = this.mainCategory
        const validSubCategory = validSubcategories[mainCategory]
        return validSubCategory ? validSubCategory.includes(v) : false
      },
      message: 'Please select from the given subcategories'
    }
  },  
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [15, 'Title is too short'],
    maxlength: [60, 'Title is too long']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [60, 'Description is too short']
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
  startDate: Date,
  endDate: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!this.startDate || !v) {
          return true // valid or the test passes if no start or end date given
        }
        return v >= this.startDate
      },
      message: 'End date must be later than start date'
    }
  },
  isFound: {
    type: Boolean,
    default: false
  } // this is for lost and found - for PUT request (user updates the post when it's found)
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