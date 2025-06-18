const express = require('express');
const router = express.Router();
const {createBooking, processPayment, cancelBooking} = require('../controllers/bookingController');
const  authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(), createBooking); 
router.post('/:id/pay', authMiddleware(), processPayment); 
router.patch('/:id/cancel', authMiddleware(), cancelBooking); 

module.exports = router;