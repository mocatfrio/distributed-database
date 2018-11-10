// define models
const book = require('../models/book');

exports.listAllBooks = (req, res) => {
  book.find({}, (err, book) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(book);
  });
};

// Create
exports.createNewBook = (req, res) =>{
  let newBook = new book({
    bookTitle: req.body.bookTitle,
    bookAuthor: req.body.bookAuthor,
    bookPublisher: req.body.bookPublisher,
    totalPages: req.body.totalPages,
    isbn: req.body.isbn,
    year: req.body.year
  });
  newBook.save((err, book) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(book);
  });
};

// Read
exports.readBook = (req, res) => {
  book.findById(req.params.bookid, (err, book) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(book);
  });
};

// Update
exports.updateBook = (req, res) => {
  book.findOneAndUpdate(
    { 
      _id: req.params.bookid 
    },
    req.body,
    { 
      new: true 
    }, (err, book) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(book);
    }
  );
};

exports.deleteBook = (req, res) => {
  book.remove({ _id: req.params.bookid }, (err, book) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Task successfully deleted!" });
  });
};