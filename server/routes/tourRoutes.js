
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { createTour, getTours , getTourDetails, addReviewToTour, getPopularTours, getToursUser, getTourReviews} = require('../controllers/tourController');
const {createTourValidator, getTourValidator} = require("../validators/tourValidator");

router.get('/admin', ...getTourValidator, getTours);
router.post('/', authMiddleware(['admin']), ...createTourValidator, createTour);

router.get('/', getToursUser); // Lấy danh sách tour (có filter, paginate)
router.get('/popular', getPopularTours); // Lấy các tour phổ biến
router.get('/:id', getTourDetails); // Lấy chi tiết một tour

router.post('/:id/reviews', authMiddleware(), addReviewToTour); 

router.get('/:id/reviews', getTourReviews);

module.exports = router;
