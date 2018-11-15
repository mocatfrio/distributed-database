const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

// initialize express app
const app = express();
const http = require('http').Server(app);

// define port
const port = 5000;

// define controllers
const bookController = require("./controllers/bookController");

// db connection
require("./config/db");

// using bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img',express.static(path.join(__dirname, 'public/img')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/vendor',express.static(path.join(__dirname, 'public/vendor')));

// Routes
app.get('/', bookController.home);
app.route("/book")
  .get(bookController.listAllBooks)
  .post(bookController.createNewBook);
app.get('/book/add', bookController.addBook);
app.route("/book/edit/:bookid")
  .get(bookController.readBook)
  .post(bookController.updateBook);
app.post('/book/delete/:bookid', bookController.deleteBook);

http.listen(port, () => {
  console.log('Server running on port ' + port)
})

module.exports = app;
