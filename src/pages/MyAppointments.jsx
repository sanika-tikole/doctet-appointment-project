import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, Plus } from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';
import API from '../services/api';
import toast from 'react-hot-toast';

const MOCK_APPOINTMENTS = [
  { _id: '1', doctor: { name: 'Dr. Sarah Johnson' }, date: '2026-03-15', time: '10:00 AM', status: 'confirmed', specialization: 'Cardiology', notes: 'Follow-up consultation' },
  { _id: '2', doctor: { name: 'Dr. Mark Chen' }, date: '2026-03-22', time: '2:00 PM', status: 'pending', specialization: 'Neurology' },
  { _id: '3', doctor: { name: 'Dr. Emily Ross' }, date: '2026-02-10', time: '9:00 AM', status: 'completed', specialization: 'Dermatology', notes: 'Annual skin check' },
  { _id: '4', doctor: { name: 'Dr. James Wilson' }, date: '2026-01-18', time: '11:00 AM', status: 'cancelled', specialization: 'Orthopedics' },
  { _id: '5', doctor: { name: 'Dr. Aisha Patel' }, date: '2026-03-30', time: '3:30 PM', status: 'confirmed', specialization: 'Pediatrics' },
];

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    } catch { /* continue */ }
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
    );
    toast.success('Appointment cancelled');
  };

  const filtered = appointments.filter((a) => {
    const matchSearch = a.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCount = (s) => appointments.filter((a) => a.status === s).length;

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1F2937]">
              My <span className="text-[#540863]">Appointments</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage all your medical appointments.</p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#540863] to-[#92487A] text-white font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus size={17} /> New Appointment
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor or specialization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#540863] text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter size={14} />
            <span className="text-gray-400 hidden sm:inline">Filter:</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 capitalize ${
                statusFilter === status
                  ? 'bg-[#540863] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#540863] hover:text-[#540863]'
              }`}
            >
              {status === 'all' ? `All (${appointments.length})` : `${status} (${statusCount(status)})`}
            </button>
          ))}
        </div>

        {/* Appointments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm h-40 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
                onCancel={['pending', 'confirmed'].includes(appt.status) ? handleCancel : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-[#FFD3D5] flex items-center justify-center mb-4">
              <Calendar size={32} className="text-[#540863]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">No appointments found</h3>
            <p className="text-gray-500 text-sm mb-5">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filter.'
                : "You haven't booked any appointments yet."}
            </p>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#540863] to-[#92487A] text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-sm"
            >
              <Plus size={16} /> Book an Appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
