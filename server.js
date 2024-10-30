const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

// Route for login
app.post('/login', (req, res) => {
  const password = req.body.password;
  if (password === 'yourpassword') { // Replace with your own logic
    res.redirect('/upload.html');
  } else {
    res.send('Invalid password');
  }
});

// Route for file upload
app.post('/upload', upload.single('video'), (req, res) => {
  const videoPath = `/uploads/${req.file.filename}`;
  res.redirect('/upload.html');
});

// Route to display uploaded videos
app.get('/videos', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.status(500).send('Unable to scan directory: ' + err);
    const videoFiles = files.filter(file => file.endsWith('.mp4')); // Adjust for other video formats
    res.json(videoFiles);
  });
});

// Route to delete a video
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send('Unable to delete file: ' + err);
    res.send('File deleted successfully!');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
