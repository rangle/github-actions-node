// const books = [
//   { name: 'Tuck Everlasting', year: 2005 },
//   { name: 'Little House on the Prairie', year: 1982 },
// ];

const assert = require('assert');
const Helper = require('../helper/helper');
const Book = require('../models/book.js');

const booksService = {
  get: (req, res) => {
    return Book.find()
      .then((books) => {
        const updatedBooksArray = [];
        books.forEach((book) => {
          book.author = Helper.retrieveAuthor();
          updatedBooksArray.push(book);
        });
        return books;
      })
      .catch((err) => {
        return err;
      });
  },

  add: function (req, res) {
    const book = new Book({
      name: req.body.name,
      year: req.body.year,
      author: req.body.author,
    });

    return book.save().catch((err) => {
      console.log(err);
      throw err;
      // res.status(400).send({ msg: 'Whoops' });
    });
  },

  retrieveLatest: (req, res) => {
    var latestBook;
    console.log(req.body);
    // latestBook = books.filter((book) => book.year > 1990);
    res.json(latestBook);
  },
};

module.exports = booksService;
