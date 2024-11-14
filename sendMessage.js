const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const botToken = process.env.TOKEN;
const channelId = '@easy_football_highlights';


async function sendMessage (title, teamNames, leagueType, imageUrl) {
const newTitle = title.replace(/_/g, ' ').replace(".","");
const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const messageText = ` <code>${newTitle}</code>\n\n #${leagueType} \n\n#${teamNames[0]}   #${teamNames[1]}\n\n@easy_football_highlights\n\n${formattedDate}\n\n  _________________________________`;
// const cleanedUrl = imageUrl.split('?')[0];
// Send the message
axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
  chat_id: channelId,
  photo: imageUrl,
  caption: messageText,
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [
        { text: "Watch Here", url: `https://easy-highlight-frontend.vercel.app/match/${title}` }
      ]
    ]
  }
})
.then(response => {
  console.log('Message sent:', response.data);
})
.catch(error => {
  console.error('Error sending message:', error);
});
}

module.exports = sendMessage