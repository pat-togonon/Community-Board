const mongoose = require('mongoose')
const { url } = require('../utils/config')

module.exports = async () => {
  await mongoose.connect(url)
}
