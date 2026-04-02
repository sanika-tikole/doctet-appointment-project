import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight, BadgeCheck } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  const {
    _id,
    name = 'Dr. Unknown',
    specialization = 'General Physician',
    experience = 0,
    rating = 0,
    reviewCount = 0,
    image,
    available = true,
  } = doctor || {};

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-[#540863]/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Image / Avatar */}
      <div className="relative h-52 bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#540863] to-[#92487A] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {initials}
          </div>
        )}
        {/* Availability badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            available
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {available ? 'Available' : 'Busy'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-[#1F2937] text-lg leading-tight">{name}</h3>
          <BadgeCheck size={18} className="text-[#540863] shrink-0 mt-0.5" />
        </div>
        <p className="text-[#540863] text-sm font-medium mb-3">{specialization}</p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            {experience} yrs exp.
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            {rating.toFixed(1)}
            <span className="text-gray-400">({reviewCount})</span>
          </span>
        </div>

        <Link
          to={`/doctors/${_id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#540863] to-[#92487A] text-white text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-sm group-hover:shadow-md"
        >
          View Profile <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
