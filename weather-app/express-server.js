const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.get('/weather', async (req, res) => {
  const location = req.query.location;
  const apiKey = "8e8f6b3377bb1dbcc33a7180033ab481";
  const weatherData = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
  );
   console.log("weather data", weatherData);

  if (weatherData.status === 200) {
    res.json(weatherData.data);
  } else {
    res.status(400).json({ error: 'Invalid location.' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001.');
});