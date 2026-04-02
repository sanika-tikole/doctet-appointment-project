const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser, approveDoctor, rejectDoctor, getAllAppointments } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

// GET  /api/admin/stats               — platform statistics
router.get('/stats', getStats);

// GET  /api/admin/users               — all users list
router.get('/users', getUsers);

// DELETE /api/admin/users/:id         — delete a user (and their doctor profile)
router.delete('/users/:id', deleteUser);

// PUT  /api/admin/approve-doctor/:id  — approve a doctor
router.put('/approve-doctor/:id', approveDoctor);

// PUT  /api/admin/reject-doctor/:id   — reject a doctor
router.put('/reject-doctor/:id', rejectDoctor);

// GET  /api/admin/appointments        — all appointments
router.get('/appointments', getAllAppointments);

module.exports = router;
