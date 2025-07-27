const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/save-location', (req, res) => {
  const { latitude, longitude } = req.body;
  const log = `Latitude: ${latitude}, Longitude: ${longitude}\n`;

  console.log(log);
res.send('Location saved.');
);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
