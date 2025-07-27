const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Ensure uploads/ directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('✅ uploads/ folder created');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// POST endpoint for form submission
app.post('/upload', upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Resume not uploaded.');
    }

    const {
      name,
      dob,
      gender,
      education,
      marital,
      preferredLocation,
      currentLocation
    } = req.body;

    const parsedLocation = currentLocation ? JSON.parse(currentLocation) : {};

    const submission = {
      timestamp: new Date().toISOString(),
      name,
      dob,
      gender,
      education,
      marital,
      preferredLocation,
      currentLocation: parsedLocation,
      resume: req.file.path
    };

    console.log('📥 New submission:', submission);
    res.status(200).send('Form data received successfully.');
  } catch (err) {
    console.error('❌ Upload error:', err.message);
    res.status(500).send(`Upload failed: ${err.message}`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
