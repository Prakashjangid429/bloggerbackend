const express = require('express');
const { createBlog, getBlogs, updateBlog,getSingle, deleteBlog, blogCounter } = require('../controllers/blog.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/new', authMiddleware, createBlog);
router.post('/:id', authMiddleware, updateBlog);
router.post('/del/:id', authMiddleware, deleteBlog);

router.get('/', getBlogs);
router.get('/user_blogs',authMiddleware, getBlogs);

router.get('/:title', getSingle);
router.get('/blog/count', blogCounter);







module.exports = router;
