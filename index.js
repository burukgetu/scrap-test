// index.js
const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

// Middleware for handling JSON requests
app.use(express.json());

// Simple GET route
app.get('/', async (req, res) => {
    const url = "https://www.fasthighlights.net/"
    const response = await axios.get(url);
    const html = response.data;
    res.send(html);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
