// index.js
const express = require('express');
const axios = require("axios");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cheerio = require("cheerio");
const cors = require("cors");
const urlGet = require('./url');
const PreviousFastMatches = require('./models/matches');
const matchDifference = require('./matcher');
const app = express();
dotenv.config();

const connectDB = async () => {
    try {
      const connection = await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected:');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1); // Exit process if connection fails
    }
  };
  
  connectDB();
// Middleware for handling JSON requests
app.use(cors({
    origin: "https://easy-highlight-frontend.vercel.app"
}));
app.use(express.json());

// Simple GET route
app.get('/', async (req, res) => {
    const url = "https://www.fasthighlights.net/"
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const element = $('section.section-block-upper #aft-archive-wrapper div.archive-grid-post')
    const links = [];

    const promises = [];

    
      element.find('div.pos-rel').each(async (i, el) => {
        let title = $(el).find('div.pad h4 a').text().trim();
        title = title.replace(" – FastHighlights", "").replace(/\s+/g, "_").replace("/", "");
        const href = $(el).find('div.pad h4 a').attr('href');

        if (!href || !href.startsWith('https://')) {
            return;
        }

        const image = $(el).find('div.read-img img').attr("src") // Example for other info
        let leagueType = $(el).find('div.category-min-read-wrap ul.cat-links li').first().text().trim();
        leagueType = leagueType + " " + $(el).find('div.category-min-read-wrap ul.cat-links li').eq(1).text().trim();
        if(leagueType === "La Liga SPAIN") leagueType = "SPAIN La Liga";
        if(leagueType === "Bundesliga Germany") leagueType = "German Bundesliga";
        if(leagueType === "England Premier League") leagueType = "English Premier League";
        let modifiedTitle = title.replace(/_\/__Highlights_Video/, "");
        let teams = modifiedTitle.split('_v_');
        let teamNames = [teams[0], teams[1]];

        const promise = urlGet(href).then((url) => {
            if (title.length > 0 && url != "......VIDEO%20LINK.....") {
                links.push({ title, href, image, leagueType, teamNames, url });
            }
        });

        promises.push(promise);
      });

      Promise.all(promises)
      .then(async () => {
        const previousmatches = await PreviousFastMatches.findOne({}, 'matches');
        const matches = matchDifference(previousmatches.matches, links)
        await matches.forEach(singleMatch => {
            previousmatches.matches.push(singleMatch); // Push each match individually
          });
        await previousmatches.save();
        res.send("Saved");
      })
      .catch((error) => {
          console.error('Error during scraping:', error);
          res.status(500).send({ error: 'Something went wrong' });
      });
});

app.get('/match/:id/:title', async (req, res) => {
    try {
      const { id, title } = req.params;  // Get the 'id' and 'title' from the URL
      const item = await PreviousFastMatches.findOne({ _id: id, 'matches.title': title }); // Find the item by id and match title
  
      if (!item) {
        return res.status(404).json({ message: 'No item found with the given id or match title' });
      }
  
      // Find the specific match within the 'matches' array
      const match = item.matches.find(m => m.title === title);
  
      if (match) {
        res.json(match);
        console.log("GET /")  // Return the specific match
      } else {
        res.status(404).json({ message: 'No match found with that title' });
        console.log("GET failed")
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});