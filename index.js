const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//
exports.Book = require('./models/book');
const booksRoute = require('./routes/booksRoute');

mongoose
  .connect('mongodb://mongodb:27017/test', {
    dbName: 'sample-db',
  })
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/books', booksRoute);

app.get('/', (req, res) => {
  res.send('Api');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
