const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer_name: { type: String, required: true },
    review_date: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
