const Review = require('../models/review.model');
const Blog = require('../models/blog.model');
const User = require('../models/user.model');

exports.addReview = async (req, res) => {
    try {
        const { rating, comment, blog } = req.body;
        const reviewer_name = req.user.id;
        const blogExists = await Blog.findById(blog);
        if (!blogExists) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const review = new Review({
            reviewer_name,
            rating,
            comment,
            blog
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


exports.getReviewsForBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { page = 1, limit = 3 } = req.query;

        const allReviews = await Review.find({ blog: blogId })
            .populate('reviewer_name', 'full_name')
            .sort({ createdAt: -1 });

        if (!allReviews || allReviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this blog" });
        }
        const reviews = allReviews
            .slice((page - 1) * limit, page * limit);

        const totalReviews = await Review.countDocuments({ blog: blogId });
        const totalPages = Math.ceil(totalReviews / limit);
        const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length;

        res.status(200).json({
            reviews,
            averageRating,
            totalPages,
            currentPage: page,
            totalReviews
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};



exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (review.reviewer_name.toString() != req.user.id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this review" });
        }
        await Review.findByIdAndDelete(review._id);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
