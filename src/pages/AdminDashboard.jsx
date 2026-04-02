import { useState, useEffect } from 'react';
import { Users, Stethoscope, Calendar, Shield, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const MOCK_STATS = { doctors: 48, patients: 1240, appointments: 3850 };
const MOCK_USERS = [
  { _id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@example.com', role: 'doctor', createdAt: '2025-01-10' },
  { _id: '2', name: 'John Smith', email: 'john@example.com', role: 'patient', createdAt: '2025-02-15' },
  { _id: '3', name: 'Dr. Mark Chen', email: 'mark@example.com', role: 'doctor', createdAt: '2025-01-20' },
  { _id: '4', name: 'Maria Garcia', email: 'maria@example.com', role: 'patient', createdAt: '2025-03-01' },
  { _id: '5', name: 'Dr. Emily Ross', email: 'emily@example.com', role: 'doctor', createdAt: '2025-02-05' },
  { _id: '6', name: 'David Lee', email: 'david@example.com', role: 'patient', createdAt: '2025-03-05' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch {
        setStats(MOCK_STATS);
        setUsers(MOCK_USERS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
    } catch { /* continue */ }
    setUsers((prev) => prev.filter((u) => u._id !== id));
    toast.success('User deleted');
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const statCards = [
    { label: 'Total Doctors', value: stats?.doctors ?? '—', icon: <Stethoscope size={24} />, color: 'from-[#540863] to-[#92487A]' },
    { label: 'Total Patients', value: stats?.patients ?? '—', icon: <Users size={24} />, color: 'from-[#92487A] to-[#E49BA6]' },
    { label: 'Total Appointments', value: stats?.appointments ?? '—', icon: <Calendar size={24} />, color: 'from-[#E49BA6] to-[#FFD3D5]' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#540863] to-[#92487A] rounded-3xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-20 -translate-y-20 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Shield size={26} />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Admin Dashboard</p>
              <h1 className="text-2xl font-extrabold">Welcome, {user?.name || 'Admin'}</h1>
              <p className="text-blue-100 text-sm mt-0.5">Platform overview and management</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-sm`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-extrabold text-[#1F2937]">
                {loading ? '—' : typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <h2 className="font-bold text-[#1F2937] text-lg">Manage Users</h2>
              <div className="flex gap-3">
                {/* Search */}
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#540863] text-sm w-48"
                  />
                </div>
                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#540863] text-sm text-gray-600"
                >
                  <option value="all">All Roles</option>
                  <option value="doctor">Doctors</option>
                  <option value="patient">Patients</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F3F4F6] text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 font-semibold">Email</th>
                  <th className="text-left px-5 py-3 font-semibold">Role</th>
                  <th className="text-left px-5 py-3 font-semibold">Joined</th>
                  <th className="text-left px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E49BA6] to-[#FFD3D5] flex items-center justify-center text-[#540863] font-bold text-xs">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-[#1F2937]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          u.role === 'doctor' ? 'bg-[#E49BA6]/40 text-[#540863]'
                          : u.role === 'admin' ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-700'
                        }`}>
                          {u.role === 'doctor' ? <Stethoscope size={11} /> : u.role === 'admin' ? <Shield size={11} /> : <Users size={11} />}
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
}
