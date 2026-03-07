const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Employee Leave System API is running' });
});

// Serve frontend static files in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
