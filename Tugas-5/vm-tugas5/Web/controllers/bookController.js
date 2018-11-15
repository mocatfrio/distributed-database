// define models
const book = require('../models/book');

exports.home = (req, res) => {
  res.render('index.ejs', { 
    title: "Bookaholic | Home",
    judul: "Holla, Bookaholic!"
  });
};

exports.listAllBooks = (req, res, next) => {
  book.find({}, (err, book) => {
    if (err) {
      res.status(500).send(err);
    }
    // res.status(200).json(book);
    res.render('book/list-book', { 
      title: 'Bookaholic | Book List', 
      judul: 'My Books',
      res: book
    });
  });
};

// Create
exports.addBook = (req, res) => {
  res.render('book/add-book', {
    title: 'Bookaholic | Add Book',
    judul: 'Add New Book'
  })
}

exports.createNewBook = (req, res) =>{
  var newBook = new book({
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
    console.log('New book saved to database!');
    res.redirect('/book');
  });
};

// Read for edit
exports.readBook = (req, res) => {
  book.findById(req.params.bookid, (err, book) => {
    if (err) {
      res.status(500).send(err);
    }
    // res.status(200).json(book);
    res.render('book/edit-book', { 
      title: 'Bookaholic | Edit Book', 
      judul: 'Edit Book',
      res: book
    });
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
      // res.status(200).json(book);
      res.redirect('/book');
    }
  );
};

exports.deleteBook = (req, res) => {
  book.deleteOne(
    { 
      _id: req.params.bookid 
    }, 
    (err, book) => {
    if (err) {
      res.status(404).send(err);
    }
    // res.status(200).json({ message: "Task successfully deleted!" });
    console.log('Book successfully deleted!');
    res.redirect('/book');
  });
};
