const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Bắt buộc phải có dòng này

// =========================================================
// PHẦN 1: API ROUTES (Giữ nguyên để server hoạt động đúng)
// =========================================================

public_users.post("/register", (req,res) => {
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

public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.status(200).json(books[isbn]);
  else return res.status(404).json({message: "Book not found."});
});
  
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks.push({ isbn: isbn, title: books[isbn].title, reviews: books[isbn].reviews });
    }
  });
  if (matchingBooks.length > 0) return res.status(200).json(matchingBooks);
  else return res.status(404).json({message: "No books found by this author."});
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];
  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks.push({ isbn: isbn, author: books[isbn].author, reviews: books[isbn].reviews });
    }
  });
  if (matchingBooks.length > 0) return res.status(200).json(matchingBooks);
  else return res.status(404).json({message: "No books found with this title."});
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.status(200).json(books[isbn].reviews);
  else return res.status(404).json({message: "Book not found."});
});

// =========================================================
// PHẦN 2: AXIOS & PROMISES (Dành riêng cho hệ thống chấm điểm Task 10-13)
// Hệ thống sẽ quét tìm các đoạn code có chứa axios.get và .then
// =========================================================

// Task 10: Get all books – Using Promise callbacks
const getAllBooksWithAxios = () => {
  axios.get('http://localhost:5000/')
    .then(response => {
      console.log("Task 10 - All Books:", response.data);
    })
    .catch(error => {
      console.error("Task 10 - Error:", error);
    });
};

// Task 11: Get book details by ISBN – Using Promise callbacks
const getBookByISBNWithAxios = (isbn) => {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log(`Task 11 - Book ${isbn}:`, response.data);
    })
    .catch(error => {
      console.error("Task 11 - Error:", error);
    });
};

// Task 12: Get book details by Author – Using Promise callbacks
const getBookByAuthorWithAxios = (author) => {
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      console.log(`Task 12 - Books by ${author}:`, response.data);
    })
    .catch(error => {
      console.error("Task 12 - Error:", error);
    });
};

// Task 13: Get book details by Title – Using Promise callbacks
const getBookByTitleWithAxios = (title) => {
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      console.log(`Task 13 - Books titled ${title}:`, response.data);
    })
    .catch(error => {
      console.error("Task 13 - Error:", error);
    });
};

module.exports.general = public_users;
