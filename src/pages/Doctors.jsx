import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import API from '../services/api';

const specializations = [
  'All', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry', 'General',
];

// Fallback mock doctors for UI preview
const MOCK_DOCTORS = [
  { _id: '1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology', experience: 12, rating: 4.9, reviewCount: 128, available: true },
  { _id: '2', name: 'Dr. Mark Chen', specialization: 'Neurology', experience: 8, rating: 4.8, reviewCount: 95, available: true },
  { _id: '3', name: 'Dr. Emily Ross', specialization: 'Dermatology', experience: 6, rating: 4.9, reviewCount: 74, available: false },
  { _id: '4', name: 'Dr. James Wilson', specialization: 'Orthopedics', experience: 15, rating: 4.7, reviewCount: 200, available: true },
  { _id: '5', name: 'Dr. Aisha Patel', specialization: 'Pediatrics', experience: 10, rating: 4.9, reviewCount: 160, available: true },
  { _id: '6', name: 'Dr. Carlos Mendez', specialization: 'Psychiatry', experience: 9, rating: 4.6, reviewCount: 88, available: true },
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSpec, setActiveSpec] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get('/doctors');
        setDoctors(data);
      } catch {
        setDoctors(MOCK_DOCTORS);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((doc) => {
    const matchSearch =
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchSpec = activeSpec === 'All' || doc.specialization === activeSpec;
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-2">
            Find a <span className="text-[#540863]">Doctor</span>
          </h1>
          <p className="text-gray-500">Browse from our network of verified medical professionals.</p>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#540863] text-sm text-[#1F2937] placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#540863]"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SlidersHorizontal size={15} />
            <span>{filtered.length} results</span>
          </div>
        </div>

        {/* Specialization Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveSpec(spec)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeSpec === spec
                  ? 'bg-[#540863] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#540863] hover:text-[#540863]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden">
                <div className="h-52 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-9 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFD3D5] flex items-center justify-center mb-4">
              <Search size={32} className="text-[#540863]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">No doctors found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setActiveSpec('All'); }}
              className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#540863] to-[#92487A] text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
