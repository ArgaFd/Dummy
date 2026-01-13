import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { UserRole } from '../types';
import { FiMenu, FiX, FiLogOut, FiHome, FiUsers, FiCoffee, FiList, FiDollarSign, FiPieChart } from 'react-icons/fi';

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  // Owner menu items
  {
    title: 'Dashboard',
    description: 'Ringkasan bisnis',
    icon: <FiHome size={20} />,
    link: '/owner/dashboard',
    color: 'bg-indigo-500',
    roles: ['owner']
  },
  {
    title: 'Manajemen Pengguna',
    description: 'Kelola akun karyawan',
    icon: <FiUsers size={20} />,
    link: '/users',
    color: 'bg-blue-500',
    roles: ['owner']
  },
  {
    title: 'Manajemen Menu',
    description: 'Kelola daftar menu',
    icon: <FiCoffee size={20} />,
    link: '/menu-management',
    color: 'bg-green-500',
    roles: ['owner']
  },
  // Staff menu items - simplified for efficiency
  {
    title: 'Daftar Pesanan',
    description: 'Kelola pesanan aktif',
    icon: <FiList size={20} />,
    link: '/staff/orders',
    color: 'bg-green-500',
    roles: ['staff']
  },
  {
    title: 'Pembayaran',
    description: 'Proses pembayaran',
    icon: <FiDollarSign size={20} />,
    link: '/staff/payments',
    color: 'bg-yellow-500',
    roles: ['staff']
  },
  // Shared menu items
  {
    title: 'Laporan',
    description: 'Lihat laporan',
    icon: <FiPieChart size={20} />,
    link: '/reports',
    color: 'bg-pink-500',
    roles: ['owner']
  }
];

interface RoleBasedDashboardProps {
  userRole: UserRole;
  children?: React.ReactNode;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ userRole, children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  // Redirect to appropriate dashboard based on user role
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(false);
    
    // Redirect to first menu item if at root
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      const firstMenuItem = filteredMenuItems[0];
      if (firstMenuItem) {
        navigate(firstMenuItem.link);
      }
    }
  }, [user, navigate, location.pathname, filteredMenuItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Mobile sidebar - overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setIsSidebarOpen(false)}
        />
        <div className="relative flex flex-col w-64 h-full bg-white">
          <div className="flex items-center justify-between h-16 px-4 bg-indigo-600">
            <span className="text-xl font-semibold text-white">Resto App</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-md text-white hover:bg-indigo-500">
              <FiX size={24} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {filteredMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  location.pathname === item.link 
                    ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-full ${item.color} text-white mr-3`}>
                  {item.icon}
                </span>
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50">
              <span className="mr-3"><FiLogOut size={20} /></span>
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - fixed */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 bg-indigo-600">
            <span className="text-xl font-semibold text-white">Resto App</span>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    location.pathname === item.link 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${item.color} text-white mr-3`}>
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                <p className="text-xs font-medium text-gray-500">{userRole === 'owner' ? 'Owner' : 'Staff'}</p>
              </div>
              <button onClick={logout} className="ml-auto p-1 text-gray-400 hover:text-gray-500">
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - takes remaining space */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top header - always visible */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <FiMenu size={24} />
              </button>
              <h1 className="ml-2 lg:ml-0 text-lg font-medium text-gray-900">
                {filteredMenuItems.find(item => item.link === location.pathname)?.title || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name || 'User'}
                </span>
              </div>
              <button onClick={logout} className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredMenuItems.find(item => item.link === location.pathname)?.title || 'Selamat Datang'}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {filteredMenuItems.find(item => item.link === location.pathname)?.description || ''}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;
