import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#540863] to-[#92487A] flex items-center justify-center">
                <Stethoscope size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Medi<span className="text-[#92487A]">Book</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted platform for booking verified doctors and managing your health appointments with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Find Doctors', to: '/doctors' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-[#92487A] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Specializations</h3>
            <ul className="space-y-2.5">
              {['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics'].map((spec) => (
                <li key={spec}>
                  <span className="text-sm text-gray-400">{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-[#92487A] shrink-0" />
                support@medibook.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-[#92487A] shrink-0" />
                +1 (800) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-[#92487A] shrink-0" />
                123 Health Street, NY 10001
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MediBook. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-[#540863]" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
