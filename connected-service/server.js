const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const mongoose = require('mongoose');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5020;

// CORS configuration (optional, uncomment to activate)
// app.use(cors({
//     origin: 'http://3.227.120.143:8080',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// }));

// Connect to PostgreSQL
const pgClient = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

pgClient.connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch(err => {
        console.error('❌ PostgreSQL connection error:', err);
        process.exit(1);
    });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Define the session schema
const sessionSchema = new mongoose.Schema({
    userId: String,
    createdAt: Date,
    updatedAt: Date,
});
const Session = mongoose.model('Session', sessionSchema);

// Utility: send standardized error responses
const sendError = (res, status, message) => {
    return res.status(status).json({ error: message });
};

// Endpoint: Get user's last session
app.get('/last-connection', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return sendError(res, 400, 'Username must be provided.');
    }

    try {
        const result = await pgClient.query('SELECT id FROM "user" WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return sendError(res, 404, 'User not found.');
        }

        const userId = result.rows[0].id;

        const lastSession = await Session.findOne({ userId }).sort({ createdAt: -1 });

        if (!lastSession) {
            return sendError(res, 404, 'No sessions found for this user.');
        }

        const timeAgo = moment(lastSession.createdAt).fromNow();

        return res.json({
            userId,
            lastConnection: timeAgo,
        });

    } catch (error) {
        console.error('❌ Internal error:', error);
        return sendError(res, 500, 'An internal server error occurred.');
    }
});

// Health check endpoint for load balancer
app.get('/connected/health', async (req, res) => {
    try {
        await pgClient.query('SELECT 1');
        await mongoose.connection.db.admin().ping();
        res.status(200).json({ status: 'healthy' });
    } catch (err) {
        console.error('❌ Health check failed:', err);
        res.status(500).json({ status: 'unhealthy', error: err.message });
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Session Service running on port ${port}`);
});