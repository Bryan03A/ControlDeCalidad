const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Get the token from the Authorization header

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
        req.userId = decoded.user_id;  // Make sure 'user_id' matches what is being encoded in the JWT
        next();  // Continue to the next middleware function
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { verifyToken };
