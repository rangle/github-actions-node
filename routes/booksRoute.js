const express = require('express');
const router = express.Router();
const booksService = require('../services/booksService');

// import { retrieveAuthor } from '../helper/helper';

router.use(express.json());

router.use((req, res, next) => {
  console.log('Middleware called on every GET Request');
  next();
});

router.use('/latest', (req, res, next) => {
  console.log('Middleware called on books/latest
  next();
});

// GET /books
router.get('/', async (req, res) => {
  try {
    const books = await booksService.get();
    res.json(books);
  } catch (err) {
    console.log(err);
  }
});

//POST /books -- add new book
router.post('/', async (req, res) => {
  try {
    const result = await booksService.add(req, res);
    console.log('Result ' + result);
    res.json({ msg: 'Successfully added book' });
    // return res.json({ msg: 'Successfully added book' });
  } catch (err) {
    console.log(err);
    res.json({ msg: 'whoops' });
  }
});

router.post('/latest', booksService.retrieveLatest);

module.exports = router;
