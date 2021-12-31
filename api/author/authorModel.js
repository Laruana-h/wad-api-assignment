const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
  name: {type: String},
  username: {type: String},
  avatar_path: {type: String},
  rating: {type: Number}
})

module.exports = mongoose.model('Authors', AuthorSchema)