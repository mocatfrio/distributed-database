const express = require('express');
const bodyParser = require('body-parser');

// define controllers
const bookController = require("./controllers/bookController");

// db instance connection
require("./config/db");

// initialize express app
const app = express();
const http = require('http').Server(app);

// define port
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API ENDPOINTS
app
  .route("/books")
  .get(bookController.listAllBooks)
  .post(bookController.createNewBook);

app
  .route("/books/:bookid")
  .get(bookController.readBook)
  .put(bookController.updateBook)
  .delete(bookController.deleteBook);

http.listen(port, () => {
  console.log('Server is up and running on port ' + port)
})

module.exports = app;
