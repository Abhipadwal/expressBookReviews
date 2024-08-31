const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return !users.some(user => user.username === username);

}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    // Check if the user is authenticated
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Extract username from session and review from request body
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews if not already present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Update the review if the user has already posted one; otherwise, add a new review
    if (books[isbn].reviews[username]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review updated successfully", reviews: books[isbn].reviews });
    } else {
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: "Review added successfully", reviews: books[isbn].reviews });
    }});

    // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Check if the user is authenticated
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Extract username from session and ISBN from request parameters
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the review exists for the user
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for the user" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
