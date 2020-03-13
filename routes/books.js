const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Async Handler function to handle routes */
function asyncHandler(callback) {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (err) {
            // if error, modify error to server error
            // res.status(500).send(error); 
            next(err);
        }
    }
}

// GET full list of books
router.get('/', asyncHandler( async (req, res) => {
    const books = await Book.findAll({ order: [["title", "ASC"]]});
    res.render('index', { books, title: 'Books' });
} ));

// GET create new book form
router.get('/new', asyncHandler( (req, res) => {
    res.render('new-book', { title: 'New Book' });
} ));

// POST new book to database
router.post('/new/', asyncHandler( async(req, res) => {
    let book;
    try {
        book = req.body;
        book.year = parseInt(book.year);
        book = await Book.create(book);
        res.redirect("/");
    } catch (err) {
        if (err.name === "SequelizeValidationError") {
            book = req.body;
            book.year = (book.year ? parseInt(book.year) : "");
            console.log(book);
            book = await Book.build(book);
            res.render('new-book', { title: "New Book", book, errors: err.errors })
        } else {
            throw error;
        }
    }
} ));


// GET - Book detail form
router.get('/:id', asyncHandler( async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    console.log(book);
    if (book) {
        res.render('update-book', { title: 'Update Book', book, existingBook: true });
    } else {
        next();
    }
}));


// POST - Updated book info in the database
router.post('/:id/', asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if(book) {
        await book.update(req.body);
        res.redirect("/books"); 
      } else {
        next();
      }
    } catch (err) {
      if(err.name === "SequelizeValidationError") {
        book = req.body;
        book.id = req.params.id;
        book.year = (book.year ? parseInt(book.year) : "");
        book = await Book.build(book);
        res.render('update-book', { title: "Update Book", book, errors: err.errors })
      } else {
        throw error;
      }
    }
  }));


// POST - Deletes a book 
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        next();
    }
}));



module.exports = router;