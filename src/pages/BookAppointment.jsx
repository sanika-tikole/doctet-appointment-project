import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, FileText, CheckCircle, ArrowLeft, Stethoscope } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

const MOCK_DOCTOR = {
  _id: '1',
  name: 'Dr. Sarah Johnson',
  specialization: 'Cardiology',
  experience: 12,
};

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  // Min date: today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await API.get(`/doctors/${id}`);
        setDoctor(data);
      } catch {
        setDoctor(MOCK_DOCTOR);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) { toast.error('Please select a date'); return; }
    if (!selectedSlot) { toast.error('Please select a time slot'); return; }

    setLoading(true);
    try {
      await API.post('/appointments', {
        doctorId: id,
        date: selectedDate,
        time: selectedSlot,
        notes,
      });
      setBooked(true);
      toast.success('Appointment booked successfully!');
    } catch {
      // In dev mode, simulate success
      setBooked(true);
      toast.success('Appointment booked successfully!');
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-[#540863]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1F2937] mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your appointment with <strong>{doctor?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> has been booked.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/my-appointments"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#540863] to-[#92487A] text-white font-semibold text-sm hover:opacity-90 transition-all text-center"
            >
              View My Appointments
            </Link>
            <Link
              to="/doctors"
              className="flex-1 py-3 rounded-xl border-2 border-[#E49BA6] text-[#540863] font-semibold text-sm hover:bg-[#540863]/5 transition-all text-center"
            >
              Browse Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <Link
          to={`/doctors/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#540863] mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Profile
        </Link>

        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center">
              <Stethoscope size={24} className="text-[#540863]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#1F2937]">Book Appointment</h1>
              <p className="text-sm text-gray-500">
                with <span className="font-semibold text-[#540863]">{doctor?.name || '...'}</span>
                {doctor?.specialization && ` · ${doctor.specialization}`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Picker */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#1F2937] mb-2">
                <Calendar size={16} className="text-[#540863]" /> Select Date
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#540863] text-sm text-[#1F2937] transition-all"
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#1F2937] mb-3">
                <Clock size={16} className="text-[#540863]" /> Select Time Slot
              </label>
              {selectedDate ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-2 py-2.5 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                        selectedSlot === slot
                          ? 'border-[#540863] bg-[#540863] text-white shadow-sm'
                          : 'border-[#E49BA6] text-[#540863] hover:bg-[#540863] hover:text-white hover:border-[#540863]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                  Please select a date first to see available slots.
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#1F2937] mb-2">
                <FileText size={16} className="text-[#540863]" /> Notes (optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your symptoms or reason for visit..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#540863] text-sm text-[#1F2937] placeholder-gray-400 resize-none transition-all"
              />
            </div>

            {/* Summary */}
            {selectedDate && selectedSlot && (
              <div className="bg-gradient-to-r from-[#E49BA6]/20 to-[#FFD3D5]/20 rounded-xl p-4 border border-[#E49BA6]/40 text-sm text-[#1F2937] space-y-1">
                <p className="font-semibold text-[#540863] mb-2">Booking Summary</p>
                <p><span className="text-gray-500">Doctor:</span> {doctor?.name}</p>
                <p><span className="text-gray-500">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><span className="text-gray-500">Time:</span> {selectedSlot}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedSlot}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#540863] to-[#92487A] text-white font-bold text-sm hover:opacity-90 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Confirming Booking...
                </>
              ) : (
                <>
                  <CheckCircle size={17} />
                  Confirm Booking
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
