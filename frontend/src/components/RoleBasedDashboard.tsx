import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedDashboardProps {
  userRole: string;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ userRole }) => {
  const { logout } = useAuth();

  // Owner menu items
  const ownerMenuItems = [
    {
      title: 'User Management',
      description: 'Kelola akun karyawan',
      icon: '👥',
      link: '/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Menu Management',
      description: 'Kelola menu restoran',
      icon: '🍽️',
      link: '/menu-management',
      color: 'bg-green-500'
    },
    {
      title: 'Orders',
      description: 'Lihat semua pesanan',
      icon: '📋',
      link: '/orders',
      color: 'bg-purple-500'
    },
    {
      title: 'Reports',
      description: 'Laporan penjualan & analytics',
      icon: '📊',
      link: '/reports',
      color: 'bg-orange-500'
    }
  ];

  // Cashier menu items
  const cashierMenuItems = [
    {
      title: 'Orders',
      description: 'Kelola pesanan aktif',
      icon: '📋',
      link: '/orders',
      color: 'bg-purple-500'
    },
    {
      title: 'Payments',
      description: 'Proses pembayaran',
      icon: '💳',
      link: '/payments',
      color: 'bg-green-500'
    }
  ];

  const menuItems = userRole === 'owner' ? ownerMenuItems : cashierMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Restaurant Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back, {userRole === 'owner' ? 'Owner' : 'Cashier'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                {userRole === 'owner' ? 'Owner' : 'Cashier'}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group relative bg-white overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${item.color}`}>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    Access →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Stats (Owner Only) */}
          {userRole === 'owner' && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">👥</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Staff
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {/* This would come from API */}
                            5
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">🍽️</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Menu Items
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {/* This would come from API */}
                            25
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">📋</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Today's Orders
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {/* This would come from API */}
                            12
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoleBasedDashboard;
