const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
function getAllBooks() {
  return new Promise((resolve, reject)=> {
    resolve(books);
  });
}
public_users.get('/',function (req, res) {
  //Write your code here
  getAllBooks()
    .then((books)=> {
      res.send(JSON.stringify(books,null,4));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error fetching users');
    });    
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
function getBookByisbn(isbn) {
  return new Promise((resolve, reject)=> {
     const book = books[isbn]; 
     if(book) {
      resolve(book);
     }
     else{
      reject("Book with isbn ${isbn} not found ");
     }
  });
}
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  getBookByisbn(isbn)
  .then((book)=>{
    res.send(book);
  })
  .catch((err)=> {
    console.error(err);
    res.status(404).send('Book not found');
  });
  
 });
  
// Get book details based on author
function getBookByAuthor(author) {
  return new Promise((resolve, reject)=> {
    const keys = Object.keys(books);
    const book_isbn = keys.filter(function(key) {
         return books[key]["author"] === author;
    });
     if(book_isbn.length > 0) {
      resolve(book_isbn);
     }
     else{
      reject("Book with author ${author} not found ");
     }
  });
}
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  //const keys = Object.keys(books);
  //const book_author = keys.filter(function(key) {
       //return books[key]["author"] === author;
  //});
  getBookByAuthor(author)
   .then((book_isbn)=> {
    res.send(books[book_isbn]);
   })
   .catch((err)=> {
    console.error(err);
    res.status(404).send('Book not found');
  });
  //console.log(book_author);
  
});

// Get all books based on title
function getBookByTitle(title) {
  return new Promise((resolve, reject)=> {
    const keys = Object.keys(books);
    const book_isbn = keys.filter(function(key) {
         return books[key]["title"] === title;
    });
     if(book_isbn.length > 0) {
      resolve(book_isbn);
     }
     else{
      reject("Book with title ${title} not found ");
     }
  });
}
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  // const keys = Object.keys(books);
  // const book_title = keys.filter(function(key) {
  //      return books[key]["title"] === title;
  // });
  //console.log(book_author);
  getBookByTitle(title)
   .then((book_isbn)=> {
    res.send(books[book_isbn]);
   })
   .catch((err)=> {
    console.error(err);
    res.status(404).send('Book not found');
  });
  //res.send(books[book_title]);
});

//  Get book review
function getBookbyReview(isbn) {
  return new Promise((resolve, reject)=> {
    const book_review = books[isbn]["reviews"];
     if(books[isbn]) {
      resolve(book_review);
     }
     else{
      reject("Book with isbn ${isbn} not found ");
     }
  });
}
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  //const book_review = books[isbn]["reviews"];
  //res.send(book_review);
  getBookbyReview(isbn)
   .then((book_review) => {
    res.send(book_review);
   })
   .catch((err)=> {
    console.error(err);
    res.status(404).send('Book not found');
   })
});

module.exports.general = public_users;
