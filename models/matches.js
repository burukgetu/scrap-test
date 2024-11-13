const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  leagueType: {
    type: String,
    required: true
  },
  teamNames: [{
    type: String,
    required: true
  }],
  url: {
    type: String,
    required: true
  }
}, { timestamps: true });

const previousSchema = new mongoose.Schema({
    matches: {
      type: [matchSchema], // An array of match objects
      required: true
    }
  }, { timestamps: true });

const PreviousFastMatches = mongoose.model('PreviousFastMatches', previousSchema);

module.exports = PreviousFastMatches;
