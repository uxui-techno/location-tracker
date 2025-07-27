const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Route to handle form submission
app.post('/submit-career-form', upload.single('resume'), (req, res) => {
  const {
    name,
    dob,
    gender,
    education,
    marital,
    preferred,
    latitude,
    longitude
  } = req.body;

  const resumePath = req.file ? req.file.path : 'No resume uploaded';

  const log = {
    timestamp: new Date().toISOString(),
    name,
    dob,
    gender,
    education,
    marital,
    preferredLocation: preferred,
    currentLocation: { latitude, longitude },
    resume: resumePath
  };

  const logFilePath = path.join(__dirname, 'submissions.json');
  let submissions = [];

  // Read existing submissions
  if (fs.existsSync(logFilePath)) {
    const data = fs.readFileSync(logFilePath, 'utf-8');
    submissions = JSON.parse(data || '[]');
  }

  submissions.push(log);
  fs.writeFileSync(logFilePath, JSON.stringify(submissions, null, 2));

  console.log('New submission:', log);
  res.send('Form submitted successfully!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
