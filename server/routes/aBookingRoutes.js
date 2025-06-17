
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


const { searchBookingIds } = require('../controllers/aBookingController');

router.get('/search-id', searchBookingIds);

module.exports = router;
