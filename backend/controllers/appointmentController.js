const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// ── Helper: populate and shape an appointment for the frontend ─────────────────
const populateAppointment = (query) =>
  query
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name email' },
    })
    .populate('patientId', 'name email');

const formatAppointment = (appt) => ({
  _id: appt._id,
  doctor: appt.doctorId
    ? {
        _id: appt.doctorId._id,
        name: appt.doctorId.userId?.name || 'Unknown Doctor',
        specialization: appt.doctorId.specialization,
      }
    : null,
  patient: appt.patientId
    ? { _id: appt.patientId._id, name: appt.patientId.name }
    : null,
  date: appt.date,
  time: appt.time,
  status: appt.status,
  specialization: appt.doctorId?.specialization || 'General',
  notes: appt.notes,
  createdAt: appt.createdAt,
});

// ─── POST /api/appointments ────────────────────────────────────────────────────
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, notes } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'doctorId, date, and time are required' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date: new Date(date),
      time,
      notes,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: { _id: appointment._id, date: appointment.date, time: appointment.time, status: appointment.status },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/appointments/my  (patient) ──────────────────────────────────────
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await populateAppointment(
      Appointment.find({ patientId: req.user._id })
    ).sort({ date: -1 });

    res.json(appointments.map(formatAppointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/appointments/doctor  (doctor) ───────────────────────────────────
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await populateAppointment(
      Appointment.find({ doctorId: doctor._id })
    ).sort({ date: -1 });

    res.json(appointments.map(formatAppointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PATCH /api/appointments/:id/cancel ───────────────────────────────────────
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Allow: the patient who owns it, the assigned doctor, or an admin
    const isPatient = appointment.patientId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    let isDoctor = false;
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      isDoctor = doctor && appointment.doctorId.toString() === doctor._id.toString();
    }

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PATCH /api/appointments/:id/confirm ──────────────────────────────────────
const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only the assigned doctor may confirm
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to confirm this appointment' });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({ message: 'Appointment confirmed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/appointments/:id  (admin hard-delete) ────────────────────────
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  confirmAppointment,
  deleteAppointment,
};
