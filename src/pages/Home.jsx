import { Link } from 'react-router-dom';
import { CalendarCheck, ShieldCheck, Users, ArrowRight, Star, Clock, Award } from 'lucide-react';

const features = [
  {
    icon: <CalendarCheck size={28} className="text-[#540863]" />,
    title: 'Easy Appointment Booking',
    desc: 'Book appointments with top doctors in just a few clicks. No long queues, no waiting rooms.',
  },
  {
    icon: <ShieldCheck size={28} className="text-[#540863]" />,
    title: 'Verified Doctors',
    desc: 'All doctors on our platform are verified and board-certified with years of clinical experience.',
  },
  {
    icon: <Users size={28} className="text-[#540863]" />,
    title: 'Secure Medical Platform',
    desc: 'Your health data is encrypted and protected. We follow HIPAA-compliant data security standards.',
  },
];

const stats = [
  { icon: <Users size={22} />, value: '10,000+', label: 'Happy Patients' },
  { icon: <Award size={22} />, value: '500+', label: 'Verified Doctors' },
  { icon: <Star size={22} />, value: '4.9/5', label: 'Average Rating' },
  { icon: <Clock size={22} />, value: '24/7', label: 'Support Available' },
];

const specializations = [
  'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry',
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#540863] via-[#6B1472] to-[#92487A] overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full bg-[#FFD3D5]/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
              #1 Healthcare Booking Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Book Doctor<br />
              Appointments<br />
              <span className="text-[#FFD3D5]">Easily</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-md leading-relaxed">
              Connect with verified, experienced doctors in minutes. Manage your health journey from the comfort of your home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 bg-white text-[#540863] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#FFD3D5] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Find Doctors <ArrowRight size={18} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3.5 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Hero Card */}
          <div className="hidden lg:flex justify-center">
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl w-full max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD3D5] flex items-center justify-center">
                  <CalendarCheck size={22} className="text-[#540863]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Next Appointment</p>
                  <p className="text-blue-200 text-sm">Today, 3:00 PM</p>
                </div>
              </div>
              {[
                { name: 'Dr. Sarah Johnson', spec: 'Cardiologist', rating: '4.9' },
                { name: 'Dr. Mark Chen', spec: 'Neurologist', rating: '4.8' },
                { name: 'Dr. Emily Ross', spec: 'Dermatologist', rating: '4.9' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center text-[#540863] font-bold text-sm">
                    {doc.name.split(' ')[1][0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{doc.name}</p>
                    <p className="text-blue-200 text-xs">{doc.spec}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-300 text-xs font-semibold">
                    <Star size={12} fill="currentColor" /> {doc.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-b border-gray-100 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center text-[#540863] mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
              Why Choose <span className="text-[#540863]">MediBook</span>?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We make healthcare accessible, transparent, and hassle-free for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#FFD3D5] rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#E49BA6]/30"
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-3">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
              Browse by Specialization
            </h2>
            <p className="text-gray-500">Find the right specialist for your healthcare needs.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {specializations.map((spec) => (
              <Link
                key={spec}
                to="/doctors"
                className="px-5 py-2.5 rounded-full border-2 border-[#E49BA6] text-[#540863] font-medium text-sm hover:bg-[#540863] hover:text-white hover:border-[#540863] transition-all duration-200"
              >
                {spec}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#540863] to-[#92487A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of patients who trust MediBook for their healthcare appointments.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-[#540863] font-bold px-8 py-4 rounded-2xl hover:bg-[#FFD3D5] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
          >
            Get Started Today <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
