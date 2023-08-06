const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(express.json());

// Allow api calls from localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// Api call to openweathermap api using axios
app.get('/api/weather', async (req, res) => {
  const { location } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!location || location.trim() === '') {
    return res.status(400).json({ error: 'Please provide a valid city name' });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});