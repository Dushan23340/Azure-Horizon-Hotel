const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { authenticate, isAdmin } = require('../middleware/auth');

// POST - Create a new booking
router.post('/', [
  body('roomId').isString().notEmpty().withMessage('Room ID is required'),
  body('checkInDate').notEmpty().withMessage('Check-in date is required'),
  body('checkOutDate').notEmpty().withMessage('Check-out date is required'),
  body('guestName').trim().notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    const checkInDateParsed = parseDateString(req.body.checkInDate);
    const checkOutDateParsed = parseDateString(req.body.checkOutDate);

    // Validate dates
    if (isNaN(checkInDateParsed.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in date format' });
    }
    if (isNaN(checkOutDateParsed.getTime())) {
      return res.status(400).json({ message: 'Invalid check-out date format' });
    }

    // Dates are parsed as UTC dates representing the calendar date
    const checkIn = checkInDateParsed;
    const checkOut = checkOutDateParsed;
    
    // Get today's date in UTC (midnight UTC) for comparison
    const now = new Date();
    const today = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ));

    // Check-in cannot be in the past (but can be today)
    // Compare dates only (ignore time) - allow today
    if (checkIn.getTime() < today.getTime()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }
    if (checkIn >= checkOut) {
      return res.status(400).json({ message: 'Check-out date must be at least one day after check-in date' });
    }

    // Check if room exists
    const room = await Room.findById(req.body.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      roomId: req.body.roomId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    const newBooking = new Booking({
      roomId: req.body.roomId,
      checkInDate: checkInDateParsed,
      checkOutDate: checkOutDateParsed,
      guestName: req.body.guestName.trim(),
      guestEmail: req.body.guestEmail.trim(),
      status: 'confirmed'
    });

    const savedBooking = await newBooking.save();
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: savedBooking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// GET - Get all bookings (authenticated users see their own, admins see all)
router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { guestEmail: req.user.email };
    const bookings = await Booking.find(query).populate('roomId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get a specific booking by ID (users can only see their own, admins can see all)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('roomId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user has access (admin or booking owner)
    if (req.user.role !== 'admin' && booking.guestEmail !== req.user.email) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;