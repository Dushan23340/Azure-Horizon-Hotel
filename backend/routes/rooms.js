const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Check room availability
router.post('/check-availability', [
  body('roomId').isString().notEmpty().withMessage('Room ID is required'),
  body('checkInDate').notEmpty().withMessage('Check-in date is required'),
  body('checkOutDate').notEmpty().withMessage('Check-out date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomId, checkInDate, checkOutDate } = req.body;
    
    // Parse dates - handle YYYY-MM-DD format (from frontend)
    // Parse date strings to avoid timezone issues
    // Create UTC dates to ensure correct date is stored in MongoDB
    const parseDateString = (dateString) => {
      // Handle YYYY-MM-DD format
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        // Create date in UTC to avoid timezone shifts when storing in MongoDB
        // This ensures December 26 stays December 26 regardless of server timezone
        return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      }
      // Fallback to standard Date parsing
      return new Date(dateString);
    };

    const checkIn = parseDateString(checkInDate);
    const checkOut = parseDateString(checkOutDate);

    // Validate dates
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Dates are parsed as UTC dates representing the calendar date
    // Get today's date in UTC (midnight UTC) for comparison
    const now = new Date();
    const today = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ));

    // Check-in cannot be in the past (but can be today)
    // Compare dates only (ignore time)
    if (checkIn.getTime() < today.getTime()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }
    if (checkIn >= checkOut) {
      return res.status(400).json({ message: 'Check-out date must be at least one day after check-in date' });
    }
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if there are any existing bookings that conflict with the requested dates
    const Booking = require('../models/Booking');
    const conflictingBooking = await Booking.findOne({
      roomId: roomId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    });

    const isAvailable = !conflictingBooking;
    
    res.json({
      roomId: roomId,
      room: room,
      available: isAvailable,
      checkInDate,
      checkOutDate,
      message: isAvailable 
        ? `Great news! The ${room.name} is available from ${checkIn.toLocaleDateString()} to ${checkOut.toLocaleDateString()}.`
        : `Unfortunately, the ${room.name} is not available for the selected dates. Please try different dates.`
    });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

module.exports = router;