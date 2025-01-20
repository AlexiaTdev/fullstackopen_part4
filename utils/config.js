require('dotenv').config()

let PORT = process.env.PORT
//let MONGODB_URI = process.env.MONGODB_URI_NOTES_PART4
let MONGODB_URI = process.env.MONGODB_URI_BLOGS_PART4

module.exports = {
  MONGODB_URI,
  PORT
}