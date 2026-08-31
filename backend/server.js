const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ===============================
// CORS
// ===============================

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// ===============================
// Server Home Page
// ===============================

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MEAN Backend</title>
      </head>
      <body style="font-family: Arial; text-align: center; margin-top: 100px;">
        <h1>🚀 MEAN Backend is Running</h1>
        <p>Express server is running successfully.</p>
        <p>Port: <strong>3000</strong></p>
        <p>
          <a href="/api/health">Check API Health</a>
        </p>
      </body>
    </html>
  `);
});

// ===============================
// MongoDB
// ===============================

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mean_test';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });

// ===============================
// Routes
// ===============================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend running successfully!'
  });
});

app.use('/api/users', userRoutes);

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});