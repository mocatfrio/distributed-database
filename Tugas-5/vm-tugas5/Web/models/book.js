const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookSchema = new schema({
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  authors: {
    type: String
    // required: true
  },
  publishedDate: {
    type: Date,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('books', bookSchema);