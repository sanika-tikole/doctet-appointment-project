const Doctor = require('../models/Doctor');
const User = require('../models/User');

// ── Helper: shape a Doctor document into the format the frontend expects ──────
const formatDoctor = (doc) => ({
  _id: doc._id,
  name: doc.userId?.name || 'Unknown',
  email: doc.userId?.email,
  specialization: doc.specialization,
  experience: doc.experience,
  rating: doc.rating,
  reviewCount: doc.reviewCount,
  slots: doc.availableSlots,
  availableSlots: doc.availableSlots,
  approved: doc.approved,
  bio: doc.bio,
  education: doc.education,
  location: doc.location,
  phone: doc.phone,
  image: doc.image,
  available: doc.availableSlots?.length > 0,
});

// ─── GET /api/doctors ─────────────────────────────────────────────────────────
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ approved: true }).populate('userId', 'name email');
    res.json(doctors.map(formatDoctor));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/doctors/:id ─────────────────────────────────────────────────────
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(formatDoctor(doctor));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/doctors/slots ──────────────────────────────────────────────────
// Doctor updates their available time slots
const updateSlots = async (req, res) => {
  try {
    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      return res.status(400).json({ message: 'slots must be an array' });
    }

    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctor.availableSlots = slots;
    await doctor.save();

    res.json({ message: 'Slots updated', slots: doctor.availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/doctors/profile ─────────────────────────────────────────────────
// Doctor updates their profile info
const updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { specialization, experience, bio, education, location, phone, name } = req.body;

    if (specialization !== undefined) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (bio !== undefined) doctor.bio = bio;
    if (education !== undefined) doctor.education = education;
    if (location !== undefined) doctor.location = location;
    if (phone !== undefined) doctor.phone = phone;

    await doctor.save();

    // Also update the name on the User document if provided
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    await doctor.populate('userId', 'name email');
    res.json({ message: 'Profile updated', doctor: formatDoctor(doctor) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, updateSlots, updateProfile };
