const express = require('express');
const { createSession, getSession, updateSession, deleteSession } = require('../controllers/sessionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new session
router.post('/', verifyToken, createSession);

// Get a session by user ID
router.get('/:userId', verifyToken, getSession);

// Update session data
router.put('/:userId', verifyToken, updateSession);

// Delete a session
router.delete('/:userId', verifyToken, deleteSession);

// Verify if the session is valid
router.get('/verify', verifyToken, (req, res) => {
    // If the token is valid, this route will be reached
    res.json({ message: 'Session is valid', user: req.user });
});

module.exports = router;