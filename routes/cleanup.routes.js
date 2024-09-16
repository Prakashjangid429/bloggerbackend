const express = require('express');
const router = express.Router();
const { deleteUnusedImages } = require('../controllers/cleanup.controller');

router.delete('/cleanup-images', deleteUnusedImages);

module.exports = router;
