const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const getBookList = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

const getBookFromISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
};

const getBooksFromAuthor = (author) => {
    return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].author === author) {
                matchingBooks.push({ isbn, title: books[isbn].title, reviews: books[isbn].reviews });
            }
        });
        if (matchingBooks.length > 0) resolve(matchingBooks);
        else reject("No books found by this author");
    });
};

const getBooksFromTitle = (title) => {
    return new Promise((resolve, reject) => {
        const matchingBooks = [];
        const isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].title === title) {
                matchingBooks.push({ isbn, author: books[isbn].author, reviews: books[isbn].reviews });
            }
        });
        if (matchingBooks.length > 0) resolve(matchingBooks);
        else reject("No books found with this title");
    });
};



public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login."});
        } else {
            return res.status(400).json({message: "User already exists!"});
        }
    }
    return res.status(400).json({message: "Unable to register user. Check username and password."});
});

// Task 10: Get the book list available in the shop (Sử dụng Async/Await)
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getBookList();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({message: error});
    }
});

// Task 11: Get book details based on ISBN (Sử dụng Promise)
public_users.get('/isbn/:isbn', function (req, res) {
    getBookFromISBN(req.params.isbn)
        .then(book => res.status(200).json(book))
        .catch(err => res.status(404).json({message: err}));
});
  
// Task 12: Get book details based on author (Sử dụng Async/Await)
public_users.get('/author/:author', async function (req, res) {
    try {
        const books = await getBooksFromAuthor(req.params.author);
        return res.status(200).json(books);
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

// Task 13: Get all books based on title (Sử dụng Promise)
public_users.get('/title/:title', function (req, res) {
    getBooksFromTitle(req.params.title)
        .then(books => res.status(200).json(books))
        .catch(err => res.status(404).json({message: err}));
});

// Get book review (Giữ nguyên vì không yêu cầu async)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Book not found."});
    }
});


const fetchBooksWithAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

module.exports.general = public_users;
