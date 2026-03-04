const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Cơ chế xác thực JWT
app.use("/customer/auth/*", function auth(req,res,next){
    // Kiểm tra xem user đã đăng nhập và có session authorization chưa
    if(req.session.authorization) {
        // Lấy token từ session
        let token = req.session.authorization['accessToken'];
        
        // Xác thực token bằng secret key 'access' (giống với lúc tạo ở login)
        jwt.verify(token, "access", (err, user) => {
            if(!err){
                req.user = user;
                next(); // Token hợp lệ, cho phép đi tiếp vào route review
            } else {
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    } else {
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));