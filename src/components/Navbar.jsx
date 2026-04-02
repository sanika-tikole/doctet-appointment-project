import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Stethoscope, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'AI Assistant', to: '/chatbot' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-[#540863] font-semibold'
      : 'text-[#1F2937] hover:text-[#540863]';

  const getDashboardPath = () => {
    if (user?.role === 'doctor') return '/doctor-dashboard';
    if (user?.role === 'admin') return '/admin-dashboard';
    return '/patient-dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#540863] to-[#92487A] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#1F2937] tracking-tight">
              Medi<span className="text-[#540863]">Book</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${isActive(link.to)}`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${isActive(getDashboardPath())}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-gradient-to-r from-[#540863] to-[#92487A] px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors duration-200 ${isActive('/login')}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-gradient-to-r from-[#540863] to-[#92487A] px-4 py-2 rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-[#1F2937] hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium py-2 transition-colors duration-200 ${isActive(link.to)}`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors duration-200 ${isActive(getDashboardPath())}`}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 w-full text-sm font-medium text-white bg-gradient-to-r from-[#540863] to-[#92487A] px-4 py-2.5 rounded-xl hover:opacity-90 transition-all"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium py-2 transition-colors duration-200 ${isActive('/login')}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-center text-sm font-medium text-white bg-gradient-to-r from-[#540863] to-[#92487A] px-4 py-2.5 rounded-xl hover:opacity-90 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
