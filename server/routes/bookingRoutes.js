const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getMyBookings, cancelBooking, getStats } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.get('/my-bookings', protect, getMyBookings);
router.get('/stats', protect, authorize('admin'), getStats);

router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
