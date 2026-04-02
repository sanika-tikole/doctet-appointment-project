import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Clock, BadgeCheck, MapPin, GraduationCap,
  Calendar, ArrowLeft, Phone, Mail,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const MOCK_DOCTOR = {
  _id: '1',
  name: 'Dr. Sarah Johnson',
  specialization: 'Cardiology',
  experience: 12,
  rating: 4.9,
  reviewCount: 128,
  available: true,
  bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience treating patients with heart conditions. She specializes in preventive cardiology, heart failure, and interventional procedures.',
  education: 'MD – Harvard Medical School | Fellowship – Johns Hopkins Hospital',
  location: 'New York, NY',
  phone: '+1 (212) 555-1234',
  email: 'dr.johnson@medibook.com',
  slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
  languages: ['English', 'Spanish'],
};

export default function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await API.get(`/doctors/${id}`);
        setDoctor(data);
      } catch {
        setDoctor(MOCK_DOCTOR);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleBook = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/book/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="w-12 h-12 rounded-full border-4 border-[#E49BA6] border-t-[#540863] animate-spin" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] gap-4">
        <p className="text-xl font-bold text-[#1F2937]">Doctor not found</p>
        <Link to="/doctors" className="text-[#540863] font-medium hover:underline">Back to Doctors</Link>
      </div>
    );
  }

  const initials = doctor.name.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('');

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#540863] mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Doctors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Image / Quick Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="h-64 bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#540863] to-[#92487A] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {initials}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-1">
                  <Star size={15} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-[#1F2937]">{doctor.rating?.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({doctor.reviewCount} reviews)</span>
                </div>
                <div className="space-y-2 text-sm text-gray-500 mt-3">
                  {doctor.location && (
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-[#540863]" />{doctor.location}</p>
                  )}
                  {doctor.phone && (
                    <p className="flex items-center gap-2"><Phone size={14} className="text-[#540863]" />{doctor.phone}</p>
                  )}
                  {doctor.email && (
                    <p className="flex items-center gap-2"><Mail size={14} className="text-[#540863]" />{doctor.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBook}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#540863] to-[#92487A] text-white font-semibold text-sm hover:opacity-90 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Calendar size={17} />
              Book Appointment
            </button>
          </div>

          {/* RIGHT — Details */}
          <div className="lg:col-span-2 space-y-5">

            {/* Name & Spec */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#1F2937]">{doctor.name}</h1>
                  <p className="text-[#540863] font-semibold mt-0.5">{doctor.specialization}</p>
                </div>
                <BadgeCheck size={24} className="text-[#540863]" />
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 bg-[#F3F4F6] px-3 py-1.5 rounded-lg">
                  <Clock size={14} className="text-[#540863]" />
                  {doctor.experience} years experience
                </span>
                {doctor.languages?.map((l) => (
                  <span key={l} className="bg-[#FFD3D5] text-[#540863] px-3 py-1.5 rounded-lg text-xs font-medium">{l}</span>
                ))}
              </div>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="font-bold text-[#1F2937] mb-3">About</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {/* Education */}
            {doctor.education && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="font-bold text-[#1F2937] mb-3 flex items-center gap-2">
                  <GraduationCap size={18} className="text-[#540863]" /> Education
                </h2>
                <p className="text-gray-600 text-sm">{doctor.education}</p>
              </div>
            )}

            {/* Available Slots */}
            {doctor.slots?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[#540863]" /> Available Time Slots
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {doctor.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={handleBook}
                      className="px-3 py-2 rounded-xl border-2 border-[#E49BA6] text-[#540863] text-xs font-medium hover:bg-[#540863] hover:text-white hover:border-[#540863] transition-all duration-200"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
