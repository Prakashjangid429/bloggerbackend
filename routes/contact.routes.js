const express = require('express');
const { createContact, getContact } = require('../controllers/contact.controller');
const router = express.Router();

router.post('/contact', createContact);
router.get('/all_quries', getContact);

module.exports = router;
