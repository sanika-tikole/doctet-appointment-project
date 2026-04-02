import { Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
  confirmed: {
    label: 'Confirmed',
    icon: <CheckCircle size={14} />,
    classes: 'bg-green-100 text-green-700',
  },
  pending: {
    label: 'Pending',
    icon: <AlertCircle size={14} />,
    classes: 'bg-yellow-100 text-yellow-700',
  },
  cancelled: {
    label: 'Cancelled',
    icon: <XCircle size={14} />,
    classes: 'bg-red-100 text-red-700',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle size={14} />,
    classes: 'bg-blue-100 text-blue-700',
  },
};

export default function AppointmentCard({ appointment, onCancel, showDoctor = true }) {
  const {
    _id,
    doctor,
    patient,
    date,
    time,
    status = 'pending',
    specialization,
    notes,
  } = appointment || {};

  const statusInfo = statusConfig[status] || statusConfig.pending;

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#540863] to-[#92487A]" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {/* Doctor/Patient info */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center">
              {showDoctor ? (
                <Stethoscope size={18} className="text-[#540863]" />
              ) : (
                <User size={18} className="text-[#540863]" />
              )}
            </div>
            <div>
              <p className="font-semibold text-[#1F2937] text-sm">
                {showDoctor
                  ? doctor?.name || 'Unknown Doctor'
                  : patient?.name || 'Unknown Patient'}
              </p>
              <p className="text-xs text-gray-500">
                {specialization || doctor?.specialization || 'General'}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.classes}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>

        {/* Date/Time */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#540863]" />
            {formatDate(date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#540863]" />
            {time || 'N/A'}
          </span>
        </div>

        {notes && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4 border border-gray-100">
            {notes}
          </p>
        )}

        {/* Cancel button (only for pending/confirmed) */}
        {onCancel && ['pending', 'confirmed'].includes(status) && (
          <button
            onClick={() => onCancel(_id)}
            className="w-full py-2 rounded-xl border-2 border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-all duration-200"
          >
            Cancel Appointment
          </button>
        )}
      </div>
    </div>
  );
}
