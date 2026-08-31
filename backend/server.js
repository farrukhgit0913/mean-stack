const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend running successfully!'
  });
});

app.use("/api/users", userRoutes);

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});