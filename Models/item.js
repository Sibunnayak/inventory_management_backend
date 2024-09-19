const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    number: { type: Number, required: true }
});

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true, enum: ['C1', 'C2', 'C3', 'C4', 'C5'] },
    partNumber: { type: String, required: true },
    dateReceived: { type: Date, required: true },
    numberReceived: { type: Number, required: true },
    dispatches: [dispatchSchema], 
    balance: { type: Number, required: true },
    qrCode: { type: String, required: true, unique: true } 
});

module.exports = mongoose.model('Item', itemSchema);
