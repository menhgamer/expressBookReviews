const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  // Kiểm tra xem username đã tồn tại trong mảng users hay chưa
  let userswithsamename = users.filter((user) => user.username === username);
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => { 
  // Kiểm tra xem username và password có khớp với dữ liệu hệ thống không
  let validusers = users.filter((user) => user.username === username && user.password === password);
  return validusers.length > 0;
}

// Chỉ những người dùng đã đăng ký mới có thể đăng nhập
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Kiểm tra xem người dùng có gửi đủ thông tin không
  if (!username || !password) {
    return res.status(400).json({ message: "Vui lòng cung cấp cả username và password." });
  }

  // Nếu thông tin đăng nhập hợp lệ
  if (authenticatedUser(username, password)) {
    // Tạo JWT token có thời hạn 1 giờ
    let accessToken = jwt.sign({
      username: username
    }, 'access', { expiresIn: 60 * 60 });

    // Lưu token và username vào session (yêu cầu bạn đã setup express-session ở file index.js)
    req.session.authorization = {
      accessToken, 
      username
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid credentials. Check username and password." });
  }
});

// Thêm hoặc cập nhật một đánh giá sách
regd_users.put("/auth/review", (req, res) => {

  const isbn = req.body.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required." });
  }

  if (books[isbn]) {

    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: `The review for the book with ISBN ${isbn} has been added/updated.`,
      reviews: books[isbn].reviews
    });

  } else {
    return res.status(404).json({ message: "Book not found." });
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).send(`Review for the book with ISBN ${isbn} posted by the user ${username} deleted.`);
    } else {
      return res.status(404).json({ message: "Review not found for this user." });
    }
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;