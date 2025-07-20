const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const sessionRoutes = require('./routes/sessions');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB Cloud'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(express.json());
app.use('/api/sessions', sessionRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Session Service is running');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Session Service is running on port ${PORT}`);
});