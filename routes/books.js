// REQUIRE
const express = require('express');
const router = express.Router();
const db = require('../models');
const { Book } = db;
const { Op } = db.Sequelize;
const errorHandler = require('../errorHandlers')

// GLOBAL VARIABLEES
let searchQuery;

// BOOKS CONFIG
const maxBooks = 6;


/* Async Handler function to handle routes */
function asyncHandler(callback) {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}


// PAGINATION FUNCTIONS

/* Number of pages */
function pagination(books) {
    let pages = Math.ceil(books.length / maxBooks);
    let pagesArray =[];
    for (p = 1; p <= pages; p++) {
        pagesArray.push(p);
    } 
    return pagesArray;
}

/* Books for current page */
function booksForPage(allBooks, page) {
    return allBooks.filter( (book, index) => {
        if ( index >= (page-1) * maxBooks && index <= (page*maxBooks) - 1 ) {
            return book;
        }
    });
}


// SEARCH FUNCTIONS

/* Search Database */
async function searchDatabase(searchQuery) {
    return await Book.findAll({
        where: {
            [Op.or]: [
                {title: { [Op.like]: `%${searchQuery}%` }},
                {author: { [Op.like]: `%${searchQuery}%` }},
                {genre: { [Op.like]: `%${searchQuery}%` }},
                {year: { [Op.like]: `%${searchQuery}%` }}
            ]
        }, 
        order: [["title", "ASC"]]
    });
}


// ROUTES

/* GET INDEX PAGE: show all books paginated */
router.get('/', asyncHandler( async (req, res) => {
    const currentPage =parseInt(req.query.page);
    if (!currentPage) {
        res.redirect('/books?page=1');
    } else {
        let allBooks  = await Book.findAll({ order: [["title", "ASC"]]});
        let page = (currentPage ? currentPage : 1);
        let pages = pagination(allBooks);
        let books = booksForPage(allBooks, page);
        res.render('books/index', { books, title: 'Books', pages, currentPage });
    }
} ));


/* GET SEARCHED INDEX PAGE: show search results paginated */
router.get('/search', asyncHandler( async (req, res) => {
    const currentPage = parseInt(req.query.page);    
    if (!currentPage) {
        res.redirect('/books/search?page=1');
    } else {
        let searchResults = await searchDatabase(searchQuery);
        let page = (currentPage ? currentPage : 1);
        let pages = pagination(searchResults);
        let books = booksForPage(searchResults, page);
        res.render('books/index', { books, title: 'Books', pages, currentPage, searchQuery});
    }
} ));


/* POST INDEX PAGE: set search and check page */
router.post('/search', asyncHandler( async (req, res) => {
    searchQuery = req.body.search;
    if (searchQuery !== "") {
        res.redirect('/books/search?page=1');
    } else {
        res.redirect('/books/search?page=1');
    }
} ));



/* GET NEW: create new book form */
router.get('/new/', asyncHandler( (req, res) => {
    res.render('books/new-book', { title: 'New Book' });
} ));

/* POST NEW: new book to database */
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
            book = await Book.build(book);
            res.render('books/new-book', { title: "New Book", book, errors: err.errors })
        } else {
            throw error;
        }
    }
} ));


/* GET ID - Book detail form */
router.get('/:id/', asyncHandler( async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('books/update-book', { title: 'Update Book', book, existingBook: true });
    } else {
        next();
    }
}));

/* POST ID - Updated book info in the database */
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
        res.render('books/update-book', { title: "Update Book", book, errors: err.errors })
      } else {
        throw error;
      }
    }
  }));


/* POST ID DELETE - Deletes a book  */
router.post('/:id/delete/', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.redirect('/books');
    } else {
        next();
    }
}));


module.exports = router;