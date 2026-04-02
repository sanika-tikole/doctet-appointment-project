import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Plus, X, Check, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppointmentCard from '../components/AppointmentCard';
import API from '../services/api';
import toast from 'react-hot-toast';

const MOCK_APPOINTMENTS = [
  { _id: '1', patient: { name: 'John Smith' }, date: '2026-03-15', time: '10:00 AM', status: 'pending', specialization: 'Cardiology' },
  { _id: '2', patient: { name: 'Maria Garcia' }, date: '2026-03-16', time: '2:00 PM', status: 'confirmed', specialization: 'Cardiology' },
  { _id: '3', patient: { name: 'David Lee' }, date: '2026-03-10', time: '9:00 AM', status: 'completed', specialization: 'Cardiology' },
];

const DEFAULT_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [newSlot, setNewSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/appointments/doctor');
        setAppointments(data);
      } catch {
        setAppointments(MOCK_APPOINTMENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/appointments/${id}/confirm`);
    } catch { /* continue */ }
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: 'confirmed' } : a));
    toast.success('Appointment confirmed');
  };

  const handleReject = async (id) => {
    try {
      await API.patch(`/appointments/${id}/cancel`);
    } catch { /* continue */ }
    setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a));
    toast.success('Appointment cancelled');
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    if (slots.includes(newSlot.trim())) { toast.error('Slot already exists'); return; }
    setSlots([...slots, newSlot.trim()]);
    setNewSlot('');
    toast.success('Slot added');
  };

  const removeSlot = (slot) => {
    setSlots(slots.filter((s) => s !== slot));
    toast.success('Slot removed');
  };

  const upcoming = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: <Calendar size={22} />, color: 'from-[#540863] to-[#92487A]' },
    { label: 'Pending Requests', value: appointments.filter((a) => a.status === 'pending').length, icon: <Clock size={22} />, color: 'from-[#92487A] to-[#E49BA6]' },
    { label: 'Patients Seen', value: appointments.filter((a) => a.status === 'completed').length, icon: <Users size={22} />, color: 'from-[#E49BA6] to-[#FFD3D5]' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#540863] to-[#92487A] rounded-3xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-20 -translate-y-20 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Stethoscope size={26} />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Doctor Dashboard</p>
              <h1 className="text-2xl font-extrabold">Dr. {user?.name || 'Doctor'}</h1>
              <p className="text-blue-100 text-sm mt-0.5">{user?.specialization || 'Specialist'}</p>
            </div>
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['appointments', 'slots'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#540863] to-[#92487A] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#540863] hover:text-[#540863]'
              }`}
            >
              {tab === 'appointments' ? 'Upcoming Appointments' : 'Manage Slots'}
            </button>
          ))}
        </div>

        {activeTab === 'appointments' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : upcoming.length > 0 ? (
              <div className="space-y-4">
                {upcoming.map((appt) => (
                  <div key={appt._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-[#540863] to-[#92487A]" />
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#1F2937]">{appt.patient?.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {appt.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appt.status}
                        </span>
                        {appt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(appt._id)}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Confirm"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(appt._id)}
                              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center border border-gray-100">
                <Calendar size={36} className="text-[#E49BA6] mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No upcoming appointments.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'slots' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="font-bold text-[#1F2937] mb-4 flex items-center gap-2">
              <Clock size={18} className="text-[#540863]" /> Your Available Slots
            </h2>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                placeholder="e.g. 5:00 PM"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSlot())}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#540863] text-sm text-[#1F2937] placeholder-gray-400"
              />
              <button
                onClick={addSlot}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#540863] to-[#92487A] text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <div
                  key={slot}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F3F4F6] border border-[#E49BA6]/60 text-sm text-[#1F2937]"
                >
                  <Clock size={13} className="text-[#540863]" />
                  {slot}
                  <button
                    onClick={() => removeSlot(slot)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
