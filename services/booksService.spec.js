const booksService = require('./booksService');
const Book = require('../models/book');

const Helper = require('../helper/helper');
const mongoose = require('mongoose');

// jest.mock('../models/book');
// jest.mock('../helper/helper');

const expected = [
  { name: 'True Grit', year: 1976, author: 'Bill Murray' },
  {
    name: 'Cloudy with a chance of meatballs',
    year: 1993,
    author: 'Bill Murray',
  },
];

// TODO: You can either declare your mock values above
// Book.find = jest.fn().mockResolvedValue([
//   { name: 'True Grit', year: 1976 },
//   { name: 'Cloudy with a chance of meatballs', year: 1993 },
// ]);

// Helper.retrieveAuthor = jest.fn().mockReturnValue('Bill Murray');

//This is run after every test block to ensure we're using the mock from above

beforeEach(() => {
  jest.resetAllMocks;
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks;
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe('test getBooks', () => {
  it('checks whether default author is added to every book', async () => {
    const data = [
      { name: 'True Grit', year: 1976 },
      { name: 'Cloudy with a chance of meatballs', year: 1993 },
    ];

    Book.find = jest.fn().mockResolvedValue([
      { name: 'True Grit', year: 1976 },
      { name: 'Cloudy with a chance of meatballs', year: 1993 },
    ]);

    Helper.retrieveAuthor = jest.fn().mockReturnValue('Bill Murray');

    //TODO
    // Book.find.mockResolvedValue(data);
    // Helper.retrieveAuthor.mockReturnValue('Bill Murray');

    const books = await booksService.get();
    expect(Helper.retrieveAuthor).toHaveBeenCalledTimes(2);
    expect(books).toEqual(expected);
  });

  it('throws exception when data does not match schema', async () => {
    const book = new Book({
      year: 1983,
      author: 'Bill Murray',
    });

    try {
      const invalidBook = await book.save();
      console.log(invalidBook);
    } catch (err) {
      expect(err).not.toBeNull();
    }
  });

  it('saves successfully if req.body data is valid', async () => {
    //have to connect to mongoose otherwise the async call book.save() will hang
    await mongoose
      .connect('mongodb://mongodb:27017', {
        dbName: 'test',
      })
      .then(() => {
        console.log('connected to mongodb');
      })
      .catch((err) => {
        console.log(err);
      });

    const req = {
      body: {
        year: 1982,
        author: '',
        name: 'something',
      },
    };
    const res = {};
    const results = await booksService.add(req, res);

    // expect(book.save).toHaveBeenCalledTimes(1);
    expect(results.name).toEqual(req.body.name);
    expect(results.year).toEqual(req.body.year);
    expect(results.author).toEqual(req.body.author);
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close();
    done();
  });
});
