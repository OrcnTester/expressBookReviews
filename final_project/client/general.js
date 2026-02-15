// final_project/client/general.js
const axios = require("axios");

// In the lab, server runs on localhost:5000
const BASE_URL = process.env.BOOKS_API_BASE_URL || "http://localhost:5000";

function normalizeError(err) {
  const status = err?.response?.status ?? 500;
  const data = err?.response?.data ?? null;
  const message = data?.message || err?.message || "Request failed";

  return { ok: false, status, error: message, data };
}

/**
 * Retrieve all books
 * GET /
 */
async function getAllBooks() {
  try {
    const res = await axios.get(`${BASE_URL}/`);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * Retrieve books by ISBN
 * GET /isbn/:isbn
 */
async function getBooksByISBN(isbn) {
  try {
    const res = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * Retrieve books by author
 * GET /author/:author
 * Must handle "not found" with 404 properly
 */
async function getBooksByAuthor(author) {
  try {
    const res = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err?.response?.status === 404) {
      return { ok: false, status: 404, error: "Author not found", data: err.response.data };
    }
    return normalizeError(err);
  }
}

/**
 * Retrieve books by title
 * GET /title/:title
 */
async function getBooksByTitle(title) {
  try {
    const res = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    return normalizeError(err);
  }
}

module.exports = {
  getAllBooks,
  getBooksByISBN,
  getBooksByAuthor,
  getBooksByTitle,
};
