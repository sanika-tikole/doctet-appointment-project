const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateSlots, updateProfile } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// NOTE: specific paths (/slots, /profile) must be defined BEFORE the dynamic /:id param

// POST /api/doctors/slots  — doctor updates their time slots
router.post('/slots', protect, authorize('doctor'), updateSlots);

// PUT /api/doctors/profile  — doctor updates their profile
router.put('/profile', protect, authorize('doctor'), updateProfile);

// GET /api/doctors  — public list of approved doctors
router.get('/', getDoctors);

// GET /api/doctors/:id  — public doctor detail
router.get('/:id', getDoctorById);

module.exports = router;
