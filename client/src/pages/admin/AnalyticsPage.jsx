import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { BarChart3, Users, Building, CalendarCheck } from 'lucide-react';

const AnalyticsPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    activeBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real scenario, this might come from a dedicated /api/bookings/stats endpoint
      // For now, we'll aggregate it manually or use available endpoints if stats endpoint isn't fully implemented
      const [usersRes, roomsRes, bookingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/rooms'),
        api.get('/bookings')
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalRooms: roomsRes.data.length,
        activeBookings: bookingsRes.data.filter(b => b.status === 'Confirmed').length
      });
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Campus-wide resource utilization and statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Rooms</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalRooms}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Bookings</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeBookings}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">System Activity</h3>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500">Detailed charts and graphs will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
