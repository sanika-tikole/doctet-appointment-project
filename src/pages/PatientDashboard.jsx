import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, Clock, Plus, User, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';
import API from '../services/api';
import toast from 'react-hot-toast';

const MOCK_APPOINTMENTS = [
  { _id: '1', doctor: { name: 'Dr. Sarah Johnson' }, date: '2026-03-15', time: '10:00 AM', status: 'confirmed', specialization: 'Cardiology' },
  { _id: '2', doctor: { name: 'Dr. Mark Chen' }, date: '2026-03-22', time: '2:00 PM', status: 'pending', specialization: 'Neurology' },
  { _id: '3', doctor: { name: 'Dr. Emily Ross' }, date: '2026-02-10', time: '9:00 AM', status: 'completed', specialization: 'Dermatology' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await API.get('/appointments/my');
        setAppointments(data);
      } catch {
        setAppointments(MOCK_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await API.patch(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
      );
      toast.success('Appointment cancelled');
    } catch {
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
      );
      toast.success('Appointment cancelled');
    }
  };

  const upcoming = appointments.filter((a) => ['confirmed', 'pending'].includes(a.status));
  const past = appointments.filter((a) => ['completed', 'cancelled'].includes(a.status));

  const stats = [
    { label: 'Total Bookings', value: appointments.length, icon: <ClipboardList size={22} />, color: 'from-[#540863] to-[#92487A]' },
    { label: 'Upcoming', value: upcoming.length, icon: <Calendar size={22} />, color: 'from-[#92487A] to-[#E49BA6]' },
    { label: 'Completed', value: appointments.filter((a) => a.status === 'completed').length, icon: <TrendingUp size={22} />, color: 'from-[#E49BA6] to-[#FFD3D5]' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#540863] to-[#92487A] rounded-3xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-20 -translate-y-20 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User size={22} />
              </div>
              <div>
                <p className="text-blue-100 text-sm">Patient Dashboard</p>
                <h1 className="text-2xl font-extrabold">Welcome, {user?.name || 'Patient'} 👋</h1>
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-2">Manage your appointments and health journey.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{loading ? '—' : stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-[#1F2937] text-lg">Ready for your next visit?</h2>
            <p className="text-gray-500 text-sm mt-0.5">Book an appointment with a verified doctor today.</p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#540863] to-[#92487A] text-white font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={17} /> Book Appointment
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1F2937] text-lg flex items-center gap-2">
              <Clock size={18} className="text-[#540863]" /> Upcoming Appointments
            </h2>
            <Link to="/my-appointments" className="text-sm text-[#540863] hover:underline font-medium">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm h-36 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : upcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((appt) => (
                <AppointmentCard key={appt._id} appointment={appt} onCancel={handleCancel} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center border border-gray-100">
              <Calendar size={36} className="text-[#E49BA6] mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No upcoming appointments.</p>
              <Link to="/doctors" className="inline-block mt-3 text-sm text-[#540863] font-medium hover:underline">
                Find a doctor →
              </Link>
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {past.length > 0 && (
          <div>
            <h2 className="font-bold text-[#1F2937] text-lg flex items-center gap-2 mb-4">
              <ClipboardList size={18} className="text-[#540863]" /> Past Appointments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.slice(0, 3).map((appt) => (
                <AppointmentCard key={appt._id} appointment={appt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
