
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { getTourDetails, addReviewToTour, getPopularTours, getToursUser, getTourReviews} = require('../controllers/tourController');


router.get('/', getToursUser); // Lấy danh sách tour (có filter, paginate)
router.get('/popular', getPopularTours); // Lấy các tour phổ biến
router.get('/:id', getTourDetails); // Lấy chi tiết một tour

router.post('/:id/reviews', authMiddleware(), addReviewToTour); 

router.get('/:id/reviews', getTourReviews);

module.exports = router;
