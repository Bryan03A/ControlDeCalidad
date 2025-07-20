const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    data: { type: Object, default: {} },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Session', sessionSchema);