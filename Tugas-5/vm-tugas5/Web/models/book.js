const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookSchema = new schema({
  bookTitle: {
    type: String,
    required: true
  },
  bookAuthor: {
    type: String,
    required: true
  },
  bookPublisher: {
    type: String,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  year: {
    type: Date,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('books', bookSchema);