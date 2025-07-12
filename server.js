// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/reed', async (req, res) => {
  try {
    // Get pagination and search terms from the query
    const { keywords, locationName, resultsToTake, resultsToSkip } = req.query;
    const reedApiKey = 'aab4336f-75a0-44f0-9b95-98d0c43bf487';

    const response = await axios.get('https://www.reed.co.uk/api/1.0/search', {
      params: { 
        keywords, 
        locationName,
        resultsToTake, // Pass pagination parameter
        resultsToSkip  // Pass pagination parameter
      },
      auth: {
        username: reedApiKey,
        password: ''
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data from Reed API', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});