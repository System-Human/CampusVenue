const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const filter = {};
    if (req.query.capacity) filter.capacity = { $gte: Number(req.query.capacity) };
    if (req.query.building) filter.building = req.query.building;
    if (req.query.roomType) filter.roomType = req.query.roomType;
    if (req.query.amenities) {
        filter.amenities = { $all: req.query.amenities.split(',') };
    }

    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, building, floor, capacity, roomType, amenities, status } = req.body;

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await Room.create({
      roomNumber, building, floor, capacity, roomType, amenities, status
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      await Room.deleteOne({ _id: room._id });
      
      // Cascade delete bookings associated with this room
      const Booking = require('../models/Booking');
      await Booking.deleteMany({ room: room._id });
      
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
