const mongoose = require('mongoose');

// const dbURI = "mongodb://mocatfrio:kocengliar@mongodb-cluster-shard-00-00-6uiy8.mongodb.net:27017,mongodb-cluster-shard-00-01-6uiy8.mongodb.net:27017,mongodb-cluster-shard-00-02-6uiy8.mongodb.net:27017/books?ssl=true&replicaSet=mongodb-cluster-shard-0&authSource=admin&retryWrites=true";
const dbURI = "mongodb://db-manager:27017,db-node1:27017,db-node2:27017/books?replicaSet=rs0";

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10,
  useNewUrlParser: true
}

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// require any models
require("../models/book");