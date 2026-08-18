const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res) => {
  const { roomId, title, description, startTime, endTime, attendeesEstimate } = req.body;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    return res.status(400).json({ message: 'End time must be strictly after start time.' });
  }

  if (start < new Date()) {
    return res.status(400).json({ message: 'Cannot book slots in the past.' });
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Verify Room Existence and Availability Status and acquire Write Lock
    const room = await Room.findOneAndUpdate(
      { _id: roomId, status: 'Available' },
      { $inc: { __v: 0 } }, // Dummy update to force a document-level write lock
      { session, new: true }
    );

    if (!room) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Room is unavailable or does not exist.' });
    }

    // 2. Strict Overlap Check within the Transaction
    const clash = await Booking.findOne({
      room: roomId,
      status: 'Confirmed',
      startTime: { $lt: end },
      endTime: { $gt: start },
    }).session(session);

    if (clash) {
      await session.abortTransaction();
      return res.status(409).json({
        message: 'Clash detected: The selected room is already booked for this time window.',
        clashingBooking: {
          title: clash.title,
          start: clash.startTime,
          end: clash.endTime,
        },
      });
    }

    // 3. Create Booking
    const newBooking = new Booking({
      room: roomId,
      user: req.user._id,
      title,
      description,
      startTime: start,
      endTime: end,
      attendeesEstimate,
      status: 'Confirmed',
    });

    await newBooking.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Room allocated and booked successfully!',
      booking: newBooking,
    });
  } catch (error) {
    await session.abortTransaction();
    if (error.message.includes('WriteConflict') || error.code === 112) {
        return res.status(409).json({ message: 'Clash detected: Concurrent booking attempt.' });
    }
    res.status(500).json({ message: 'Booking failed due to server error', error: error.message });
  } finally {
    session.endSession();
  }
};

exports.getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.roomId) filter.room = req.query.roomId;
    if (req.query.startDate && req.query.endDate) {
      filter.startTime = { $gte: new Date(req.query.startDate) };
      filter.endTime = { $lte: new Date(req.query.endDate) };
    } else if (req.query.date) {
        const startOfDay = new Date(req.query.date);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(req.query.date);
        endOfDay.setHours(23,59,59,999);
        filter.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const bookings = await Booking.find(filter).populate('user', 'name email').populate('room', 'roomNumber building');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room', 'roomNumber building');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure user owns booking OR user is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getStats = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: 'Confirmed', endTime: { $gte: new Date() } });
        const totalUsers = await require('../models/User').countDocuments();
        
        res.json({
            totalRooms,
            activeBookings,
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
