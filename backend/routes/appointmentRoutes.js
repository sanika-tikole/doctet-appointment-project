const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  confirmAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// POST /api/appointments  — patient books an appointment
router.post('/', protect, authorize('patient'), bookAppointment);

// GET /api/appointments/my  — patient views their own appointments
router.get('/my', protect, authorize('patient'), getMyAppointments);

// GET /api/appointments/doctor  — doctor views their appointment list
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);

// PATCH /api/appointments/:id/cancel  — patient, doctor, or admin cancels
router.patch('/:id/cancel', protect, cancelAppointment);

// PATCH /api/appointments/:id/confirm  — doctor confirms a pending appointment
router.patch('/:id/confirm', protect, authorize('doctor'), confirmAppointment);

// DELETE /api/appointments/:id  — admin hard-deletes a record
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

module.exports = router;
