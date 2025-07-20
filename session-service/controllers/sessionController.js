const Session = require('../models/session');

// Create or update a session
const createSession = async (req, res) => {
    const { data } = req.body;
    const userId = req.userId; // extracted from middleware `verifyToken`

    try {
        // Check if session already exists for the user
        let session = await Session.findOne({ userId });

        if (session) {
            // If a session exists, update it
            session.data = data;  // Update session data
            await session.save();  // Save updated session
            return res.status(200).json({ message: 'Session updated', session });
        } else {
            // If no session exists, create a new one
            session = new Session({ userId, data });
            await session.save();
            return res.status(201).json({ message: 'Session created', session });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating session', error: error.message });
    }
};

// Get a session by userId
const getSession = async (req, res) => {
    const { userId } = req.params;
    try {
        const session = await Session.findOne({ userId });
        if (session) {
            res.status(200).json(session);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching session', error: error.message });
    }
};

// Update session data
const updateSession = async (req, res) => {
    const { userId } = req.params;
    const { data } = req.body;

    try {
        // Find the user's session
        let session = await Session.findOne({ userId });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // If the `text` field is present in the data, update only that field
        if (data && data.text !== undefined) {
            session.data.text = data.text || session.data.text;  // If the text is empty, keep the previous one
        }

        // Save the updated session
        session = await session.save();

        res.status(200).json({ message: 'Session updated', session });
    } catch (error) {
        res.status(500).json({ message: 'Error updating session', error: error.message });
    }
};

// Delete a session
const deleteSession = async (req, res) => {
    const { userId } = req.params;
    try {
        const session = await Session.findOneAndDelete({ userId });
        if (session) {
            res.status(200).json({ message: 'Session deleted' });
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting session', error: error.message });
    }
};

module.exports = { createSession, getSession, updateSession, deleteSession };