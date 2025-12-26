const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const { authenticate, isAdmin } = require('../middleware/auth');

// POST - Create a new reservation inquiry
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('checkInDate').notEmpty().withMessage('Check-in date is required'),
  body('checkOutDate').notEmpty().withMessage('Check-out date is required'),
  body('guests').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse dates - handle YYYY-MM-DD format (from frontend)
    const parseDateString = (dateString) => {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      }
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

    // Set time to midnight for accurate date comparison
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
    if (checkIn.getTime() < today.getTime()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }
    if (checkIn >= checkOut) {
      return res.status(400).json({ message: 'Check-out date must be at least one day after check-in date' });
    }

    const newInquiry = new Inquiry({
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone?.trim() || '',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: req.body.guests || '2',
      message: req.body.message?.trim() || '',
      status: 'pending'
    });

    const savedInquiry = await newInquiry.save();
    
    res.status(201).json({
      message: 'Reservation inquiry submitted successfully. Our team will contact you within 24 hours.',
      inquiry: savedInquiry
    });
  } catch (error) {
    console.error('Inquiry error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// GET - Get all inquiries (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = status ? { status } : {};

    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Inquiry.countDocuments(query);

    res.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get a specific inquiry by ID (admin only)
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update inquiry status (admin only)
router.put('/:id/status', authenticate, isAdmin, [
  body('status').isIn(['pending', 'contacted', 'booked', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiry.status = req.body.status;
    await inquiry.save();

    res.json({
      message: 'Inquiry status updated successfully',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

