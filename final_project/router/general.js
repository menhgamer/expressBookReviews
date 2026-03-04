const express = require('express');
const axios = require('axios');
const public_users = express.Router();


// ================= GET ALL BOOKS =================
public_users.get('/', (req, res) => {

  axios.get('http://localhost:5000/')
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error retrieving books" });
    });

});


// ================= GET BOOK BY ISBN =================
public_users.get('/isbn/:isbn', (req, res) => {

  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({ message: "Book not found." });
    });

});


// ================= GET BOOK BY AUTHOR =================
public_users.get('/author/:author', (req, res) => {

  const author = req.params.author;

  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({ message: "No books found by this author." });
    });

});


// ================= GET BOOK BY TITLE =================
public_users.get('/title/:title', (req, res) => {

  const title = req.params.title;

  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({ message: "No books found with this title." });
    });

});

module.exports.general = public_users;