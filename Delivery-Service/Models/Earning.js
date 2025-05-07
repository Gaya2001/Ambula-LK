// models/Earning.js
const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery'
    },
    bonus: {
        type: Number,
        default: 0
    },
    tips: {
        type: Number,
        default: 0
    },
    totalEarning: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

const Earnings = mongoose.model('Earnings', earningsSchema);

module.exports = Earnings;
