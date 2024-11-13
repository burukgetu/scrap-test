// const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
// const app = express();

// // Middleware for handling JSON requests
// app.use(express.json());

// Simple GET route
// app.get('/', async (req, res) => {
    async function urlGet(href) {
    // const href = "https://www.fasthighlights.net/2024/11/manchester-united-v-leicester-city-highlights-video-fasthighlights-2/"
    const response = await axios.get(href);
    const $ = cheerio.load(response.data);
    const videoSrc = $('video source').attr('src');
    
    return videoSrc
}

module.exports = urlGet

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });