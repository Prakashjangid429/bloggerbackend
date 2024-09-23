const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/reviews',authMiddleware, reviewController.addReview);

router.get('/reviews/:blogId', reviewController.getReviewsForBlog);

router.delete('/reviews/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router;
