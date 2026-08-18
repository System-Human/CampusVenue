const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserStatus, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router.route('/:id/status')
  .patch(protect, authorize('admin'), updateUserStatus);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
