const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        // required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('googleData', googleSchema);