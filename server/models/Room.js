const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number / identifier is required'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  building: {
    type: String,
    required: [true, 'Block / Building name is required'],
    trim: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: 1,
  },
  roomType: {
    type: String,
    enum: ['Classroom', 'Seminar Hall', 'Auditorium', 'Computer Lab', 'Conference Room'],
    required: true,
  },
  amenities: [{
    type: String,
    enum: ['Projector', 'Air Conditioning', 'Audio System', 'Smart Board', 'Video Conferencing', 'Wi-Fi', 'LAN Ports'],
  }],
  status: {
    type: String,
    enum: ['Available', 'Maintenance', 'Inactive'],
    default: 'Available',
    index: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
