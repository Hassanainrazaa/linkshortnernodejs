const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true
    },
    visitHistory: [{
        timestamp: { type: Number } // If this is a custom timestamp field
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},
    { timestamps: true } // This will add createdAt and updatedAt automatically
);

const URL = mongoose.model('url', urlSchema);

module.exports = URL;
