// index.js
const express = require('express');
const app = express();

// Middleware for handling JSON requests
app.use(express.json());

// Simple GET route
app.get('/', (req, res) => {
  res.send('Hello from Cyclic Node.js backend!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
