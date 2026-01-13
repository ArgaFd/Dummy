import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OrderListPage from './staff/OrderListPage';
import PaymentListPage from './staff/PaymentListPage';
import { FiUsers, FiCoffee, FiFileText, FiTrendingUp } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  // If no user, redirect to login (handled by ProtectedRoute)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-modern h-12 w-12"></div>
      </div>
    );
  }

  const isPaymentPage = location.pathname.includes('/payments');

  // Dashboard content based on role
  if (user.role === 'owner') {
    const stats = [
      {
        title: 'Total Pengguna',
        value: '12',
        icon: FiUsers,
        gradient: 'from-purple-500 to-indigo-600',
        change: '+2.5%',
        changeType: 'increase'
      },
      {
        title: 'Total Menu',
        value: '48',
        icon: FiCoffee,
        gradient: 'from-green-500 to-emerald-600',
        change: '+12.3%',
        changeType: 'increase'
      },
      {
        title: 'Laporan Hari Ini',
        value: '5',
        icon: FiFileText,
        gradient: 'from-blue-500 to-cyan-600',
        change: '+8.1%',
        changeType: 'increase'
      },
      {
        title: 'Pertumbuhan',
        value: '23%',
        icon: FiTrendingUp,
        gradient: 'from-pink-500 to-rose-600',
        change: '+5.4%',
        changeType: 'increase'
      }
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="glass-card-light p-6">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Selamat datang di dashboard manajemen restoran!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stats-card group animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-semibold ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">vs bulan lalu</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Decorative Element */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-card-light p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-modern btn-gradient-primary">
              <FiUsers className="w-5 h-5 mr-2" />
              Tambah Pengguna
            </button>
            <button className="btn-modern btn-gradient-accent">
              <FiCoffee className="w-5 h-5 mr-2" />
              Tambah Menu
            </button>
            <button className="btn-modern btn-gradient-success">
              <FiFileText className="w-5 h-5 mr-2" />
              Lihat Laporan
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card-light p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Activity Item {index + 1}</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Staff view
  return isPaymentPage ? <PaymentListPage /> : <OrderListPage />;
};

export default DashboardPage;

