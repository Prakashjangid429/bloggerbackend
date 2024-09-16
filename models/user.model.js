const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, unique: true },
    password: { type: String, required: true },
    date_of_birth: { type: String },
    address: { type: String },
    country: { type: String },
    social: { type: [String] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
