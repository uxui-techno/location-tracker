const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/save-location', (req, res) => {
  const { latitude, longitude } = req.body;
  const log = `Latitude: ${latitude}, Longitude: ${longitude}`;

  console.log(log);  // Log the location to the Render logs
  res.send('Location saved.');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
