const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: Number,
  author: String,
});
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
