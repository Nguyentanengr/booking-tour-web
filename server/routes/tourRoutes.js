
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { createTour, getTours } = require('../controllers/tourController');
const {createTourValidator, getTourValidator} = require("../validators/tourValidator");

router.get('/', ...getTourValidator, getTours);
router.post('/', authMiddleware(['admin']), ...createTourValidator, createTour);

module.exports = router;
