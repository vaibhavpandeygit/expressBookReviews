const express = require('express');
const JWT = require('jsonwebtoken');
let books = require("./booksdb.js").books;
const regd_users = express.Router();

let users = [];

const SECRET_KEY = 'asdfghjuytrewsdvbnjuyt';

const isValid = (username)=>{
  const user = users.find(e=>e.username === username)

  if(user){
    return true
  }
  return false
}

//middleware to authenticate user with token 

const authenticatedUser = (req,res,next)=>{
  const token = req.headers.authorization;
  let decode = {};
  if(!token){
    return res.send({message:"Your are Not authorized"});
  }

  try {
    decode = JWT.verify(token,SECRET_KEY);
  } catch (error) {
    return res.send({message: "Token Not Valid"})
  }

  req.user = decode.username;
  next();
  
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const {username,password} = req.body
  let user = {};
  
  if(isValid(username)){
    user = users.find(e=>e.username===username)
  }
  else{
    return res.send({message: "Invalid User"})
  }
  try {
    if(user.username==username && user.password == password){

      const token = JWT.sign({ username: user.username }, SECRET_KEY);
      return res.status(300).json({message: "User Loged In Successfully",token:token});
    }
    else{
      return res.status(500).send({message: "Invalid Userid Or Password"})
    }
  } catch (error) {
    return res.send({message: error.message})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn",authenticatedUser,(req, res) => {
  
  const isbn = req.params.isbn;
  const review = req.query.review
  
  books[isbn].reviews.push({
    username: req.user,
    review: review
  })
  res.send(`The review for the book with ISBN ${isbn} has been added/updated`)

});

regd_users.delete("/auth/review/:isbn",authenticatedUser,(req, res) => {
  
  const isbn = req.params.isbn;
  
  books[isbn].reviews = books[isbn].reviews.filter(e=> e.username != req.user)

  return res.send(`The reviews for the book with ISBN ${isbn} posted by user: ${req.user} have been deleted`)

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;