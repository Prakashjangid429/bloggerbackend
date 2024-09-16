const express = require('express');
const { register, login, viewProfile, updateProfile, updatePassword } = require('../controllers/auth.controller');
const requestCounter = require('../middlewares/counter.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', requestCounter, login);
router.get('/profile', authMiddleware, viewProfile);
router.post('/update', authMiddleware, updateProfile);
router.post('/update_pass', authMiddleware, updatePassword);

module.exports = router;
