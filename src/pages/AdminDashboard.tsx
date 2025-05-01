import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';

// Admin components
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatCard from '@/components/admin/StatCard';

// Icons
import { Users, Calendar, Award, BookOpen, MessageCircle, AlertTriangle, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';

interface DashboardStats {
  counts: {
    events: number;
    registrations: number;
    speakers: number;
    sponsors: number;
    contacts: number;
    unreadContacts: number;
  };
  eventRegistrations: {
    eventTitle: string;
    count: number;
  }[];
  paymentStatusData: {
    _id: string;
    count: number;
  }[];
  recentRegistrations: any[];
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    counts: {
      events: 0,
      registrations: 0,
      speakers: 0,
      sponsors: 0,
      contacts: 0,
      unreadContacts: 0
    },
    eventRegistrations: [],
    paymentStatusData: [],
    recentRegistrations: []
  });
  const navigate = useNavigate();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin');
        return;
      }
      
      const response = await adminApi.get('/api/admin/dashboard');
      
      setStats(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center font-heading">
        <Loader2 className="h-12 w-12 animate-spin text-amber-500 mr-2" />
        <span className="text-gray-800 font-bold">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center font-heading">
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline font-bold">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-heading">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="mt-4 sm:mt-0">
              <Button 
                variant="outline" 
                className="border-amber-500 text-amber-500 hover:bg-amber-50 font-bold"
                onClick={() => navigate('/admin/events')}
              >
                View All Events
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Events" 
              value={stats.counts.events} 
              icon={<Calendar size={24} className="text-blue-600" />} 
              color="bg-blue-50 text-blue-800"
              gradient="bg-gradient-to-br from-blue-50 to-blue-100"
            />
            <StatCard 
              title="Registrations" 
              value={stats.counts.registrations} 
              icon={<Users size={24} className="text-green-600" />} 
              color="bg-green-50 text-green-800"
              gradient="bg-gradient-to-br from-green-50 to-green-100"
            />
            <StatCard 
              title="Speakers" 
              value={stats.counts.speakers} 
              icon={<Award size={24} className="text-amber-600" />} 
              color="bg-amber-50 text-amber-800"
              gradient="bg-gradient-to-br from-amber-50 to-amber-100"
            />
            <StatCard 
              title="Sponsors" 
              value={stats.counts.sponsors} 
              icon={<BookOpen size={24} className="text-purple-600" />} 
              color="bg-purple-50 text-purple-800"
              gradient="bg-gradient-to-br from-purple-50 to-purple-100"
            />
            <StatCard 
              title="Contact Messages" 
              value={stats.counts.contacts} 
              icon={<MessageCircle size={24} className="text-indigo-600" />} 
              color="bg-indigo-50 text-indigo-800"
              gradient="bg-gradient-to-br from-indigo-50 to-indigo-100"
            />
            <StatCard 
              title="Unread Messages" 
              value={stats.counts.unreadContacts} 
              icon={<AlertTriangle size={24} className="text-red-600" />} 
              color="bg-red-50 text-red-800"
              gradient="bg-gradient-to-br from-red-50 to-red-100"
            />
          </div>
          
          {/* Charts and Data Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Registrations by Event</h2>
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-white to-gray-50 rounded-md">
                {stats.eventRegistrations && stats.eventRegistrations.length > 0 ? (
                  <div className="w-full h-full p-4">
                    {stats.eventRegistrations.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-gray-800">{item.eventTitle}</span>
                          <span className="text-sm font-bold text-gray-600">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (item.count / stats.counts.registrations) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 font-bold">
                    Registration data visualization will be implemented soon.
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Payment Status</h2>
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-white to-gray-50 rounded-md">
                {stats.paymentStatusData && stats.paymentStatusData.length > 0 ? (
                  <div className="w-full h-full p-4">
                    {stats.paymentStatusData.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-gray-800">
                            {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                          </span>
                          <span className="text-sm font-bold text-gray-600">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item._id === 'completed' ? 'bg-green-500' : 
                              item._id === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (item.count / stats.counts.registrations) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 font-bold">
                    Payment status visualization will be implemented soon.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Recent activity */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 font-bold"
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            {stats.recentRegistrations && stats.recentRegistrations.length > 0 ? (
              <div className="space-y-4">
                {stats.recentRegistrations.map((reg, index) => (
                  <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-md border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold mr-3">
                      {reg.name ? reg.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {reg.name} registered for {reg.event?.title || 'an event'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(reg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 bg-gradient-to-br from-white to-gray-50 rounded-md font-medium">
                No recent activities found
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 