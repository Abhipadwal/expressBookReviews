const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        // Simulate fetching books from a database or service
        resolve(books); // Resolve with the books object
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({ message: 'Error fetching book list', error: error.message });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book); // Resolve with the book details if found
        } else {
            reject(new Error(`Book with ISBN ${isbn} not found.`)); // Reject with error if not found
        }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({ message: error.message });
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    let book = Object.values(books).filter(
        book => book.author === author
    );

    if (book) {
        res.send(book);
    } else {
        res.status(404).send(`Book with author ${author} not found.`);
    }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    let book = Object.values(books).filter(
        book => book.title === title
    );

    if (book) {
        res.send(book);
    } else {
        res.status(404).send(`Book with author ${title} not found.`);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const review = req.params.reviews;
    let book = Object.values(books).filter(
        book => book.reviews === review
    );

    if (book) {
        res.send(book);
    }
});

module.exports.general = public_users;
