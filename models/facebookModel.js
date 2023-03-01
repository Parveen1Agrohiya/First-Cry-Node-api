const mongoose = require('mongoose');

const facebookSchema = new mongoose.Schema({
    facebookId: {
        type: String
    },
    displayName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('facebookData', facebookSchema);