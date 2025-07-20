require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const sessionRoutes = require('./routes/sessions');
const authenticateToken = require('./middlewares/authMiddleware');
const cors = require('cors');

// MongoDB connection string  🚀
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5004;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined. Check your .env file.");
    process.exit(1); // Stops execution if connection is lost
}

const app = express();


// app.use(cors({
//    origin: '*',  // Allow requests only from your frontend
//    credentials: true  // Allows sending cookies and authentication headers
//}));

// Middleware
app.use(express.json());
app.use('/api/sessions', sessionRoutes);

app.get('/session/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Session Service running on port ${PORT}`);
});