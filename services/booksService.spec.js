const booksService = require('./booksService');
const Book = require('../models/book');

const Helper = require('../helper/helper');
const mongoose = require('mongoose');

//TODO
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
  jest.clearAllMocks();
});

afterEach(() => {
  jest.resetAllMocks;
  jest.clearAllMocks();
});

describe('test getBooks', () => {
  beforeAll(async () => {
    //have to connect to mongoose otherwise the async call book.save() will hang
    await mongoose
      .connect('mongodb://mongodb:27017/test', {
        dbName: 'sample-db',
      })
      .then(() => {
        console.log('connected to mongodb');
      })
      .catch((err) => {
        console.log(err);
      });
  });

  afterAll((done) => {
    mongoose.connection.close();
    done();
  });

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

    // Different ways to assert and capture error
    await expect(book.save()).rejects.toThrow(
      new Error('Book validation failed: name: Path `name` is required.'),
    );

    // try {
    // const invalidBook = await book.save();
    // console.log(invalidBook);
    // } catch (err) {
    //   expect(err).toBe(ValidationError);
    //   // expect(err).not.toBeNull();
    // }
  });

  it('saves successfully if req.body data is valid', async () => {
    const req = {
      body: {
        year: 1982,
        author: '',
        name: 'something',
      },
    };
    const res = {};
    const results = await booksService.add(req, res);

    expect(results.name).toEqual(req.body);
    expect(results.year).toEqual(req.body.year);
    expect(results.author).toEqual(req.body.author);

    // await expect(booksService.add(req, res)).resolves.toEqual(req.body);
  });
});
