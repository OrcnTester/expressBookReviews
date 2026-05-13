const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = decodeURIComponent(req.params.author).toLowerCase();

    const result = Object.fromEntries(
        Object.entries(books).filter(([isbn, book]) =>
            book.author.toLowerCase().includes(author)
        )
    );

    if (Object.keys(result).length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(result);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = decodeURIComponent(req.params.title).toLowerCase();

    const result = Object.fromEntries(
        Object.entries(books).filter(([isbn, book]) =>
            book.title.toLowerCase().includes(title)
        )
    );

    if (Object.keys(result).length === 0) {
        return res.status(404).json({ message: "No books found for this title" });
    }

    return res.status(200).json(result);
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn].reviews);
});

// Axios / Promise examples for assignment requirement
function getAllBooksUsingAxios() {
    return axios.get(`${BASE_URL}/`)
        .then(response => response.data)
        .catch(error => ({ error: error.message }));
}

function getBookByISBNUsingAxios(isbn) {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => response.data)
        .catch(error => ({ error: error.message }));
}

async function getBooksByAuthorUsingAxios(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        return { error: error.message };
    }
}

async function getBooksByTitleUsingAxios(title) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        return { error: error.message };
    }
}

module.exports.general = public_users;
module.exports.getAllBooksUsingAxios = getAllBooksUsingAxios;
module.exports.getBookByISBNUsingAxios = getBookByISBNUsingAxios;
module.exports.getBooksByAuthorUsingAxios = getBooksByAuthorUsingAxios;
module.exports.getBooksByTitleUsingAxios = getBooksByTitleUsingAxios;
