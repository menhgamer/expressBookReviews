const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// ================= REGISTER =================
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  return new Promise((resolve, reject) => {

    if (!username || !password) {
      reject("Unable to register user. Check username and password.");
    }

    if (isValid(username)) {
      reject("User already exists!");
    }

    users.push({ username, password });
    resolve("User successfully registered. Now you can login.");

  })
  .then((message) => res.status(200).json({ message }))
  .catch((err) => res.status(400).json({ message: err }));
});


// ================= GET ALL BOOKS =================
public_users.get('/', (req, res) => {

  return new Promise((resolve) => {
    resolve(books);
  })
  .then((data) => res.status(200).json(data))
  .catch(() => res.status(500).json({ message: "Error retrieving books" }));

});


// ================= GET BOOK BY ISBN =================
public_users.get('/isbn/:isbn', (req, res) => {

  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {

    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found.");
    }

  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json({ message: err }));

});


// ================= GET BOOK BY AUTHOR =================
public_users.get('/author/:author', (req, res) => {

  const author = req.params.author;

  return new Promise((resolve, reject) => {

    const filteredBooks = Object.values(books).filter(book =>
      book.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found by this author.");
    }

  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(404).json({ message: err }));

});


// ================= GET BOOK BY TITLE =================
public_users.get('/title/:title', (req, res) => {

  const title = req.params.title;

  return new Promise((resolve, reject) => {

    const filteredBooks = Object.values(books).filter(book =>
      book.title.toLowerCase() === title.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title.");
    }

  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(404).json({ message: err }));

});


// ================= GET BOOK REVIEW =================
public_users.get('/review/:isbn', (req, res) => {

  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {

    if (books[isbn]) {
      resolve(books[isbn].reviews);
    } else {
      reject("Book not found.");
    }

  })
  .then((reviews) => res.status(200).json(reviews))
  .catch((err) => res.status(404).json({ message: err }));

});

module.exports.general = public_users;