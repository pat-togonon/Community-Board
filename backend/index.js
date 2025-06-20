const app = require('./app')
require('dotenv').config()

app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${process.env.PORT}`)
  }
})