// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Blog', blogSchema);


const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    tags: { type: [String] },
    rating: {
        average: { type: Number, min: 0, max: 5, default: 0 },
        total_reviews: { type: Number, default: 0 }
    },
    view_count: { type: Number, default: 0 },
    blog_url: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    publication_date: { type: Date, default: null }, 
    last_updated: { type: Date, default: Date.now },
    ranking: { type: Number, default: 0 },
    image_url: { type: String },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
