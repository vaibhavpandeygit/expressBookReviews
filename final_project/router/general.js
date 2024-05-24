const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const {username,password} = req.body
  const existingUser = isValid(username);

  if(!existingUser){
    users.push({
      username: username,
      password: password
    })
    res.status(201).send({
      message: "User Registered Successfully, Now You Can Login"
    })
  }
  else{
    return res.send({message: "Allready registered"})
  }
  
});

//get all the users 
public_users.get('/getusers',(req,res)=>{
  res.send(users)
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]
    res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    for(const i in books){
      if(books[i].author === author){
          res.send(books[i]);
      }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  for(const i in books){
    if(books[i].title === title){
        res.send(books[i]);
    }
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;

  res.send(review);
});

module.exports.general = public_users;
