const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      // Nếu isValid trả về false, tức là user chưa tồn tại
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login."});
    } else {
      return res.status(400).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register user. Check username and password."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Trả về toàn bộ danh sách sách, định dạng JSON cho dễ đọc
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found."});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  
  // Duyệt qua tất cả các keys (ISBNs) của object books
  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks.push({
        isbn: isbn,
        title: books[isbn].title,
        reviews: books[isbn].reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found by this author."});
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];
  
  const isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks.push({
        isbn: isbn,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found with this title."});
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found."});
  }
});

module.exports.general = public_users;