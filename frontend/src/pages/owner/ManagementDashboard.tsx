import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiCoffee, FiBarChart2, FiLogOut, FiMenu, FiHome, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import UserManagementPage from './UserManagementPage';
import MenuManagementPage from './MenuManagementPage';
import ReportsPage from './ReportsPage';

const ManagementDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'users', label: 'Manajemen Pengguna', icon: <FiUsers /> },
    { id: 'menu', label: 'Manajemen Menu', icon: <FiCoffee /> },
    { id: 'reports', label: 'Laporan', icon: <FiBarChart2 /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600">Selamat datang di dashboard manajemen!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <span className="text-indigo-600"><FiUsers /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total Pengguna</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-green-600"><FiCoffee /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total Menu</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-blue-600"><FiBarChart2 /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Laporan Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </div>
          </div>
        </div>;
      case 'users':
        return <UserManagementPage />;
      case 'menu':
        return <MenuManagementPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600">Selamat datang di dashboard manajemen!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <span className="text-indigo-600"><FiUsers /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total Pengguna</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-green-600"><FiCoffee /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total Menu</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-blue-600"><FiBarChart2 /></span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Laporan Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </div>
          </div>
        </div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Restaurant App</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <span className="h-6 w-6"><FiX /></span>
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            <Link
              to="/menu-management"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="mr-3 h-5 w-5"><FiHome /></span>
              Dashboard
            </Link>
            <Link
              to="/users"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="mr-3 h-5 w-5"><FiUsers /></span>
              Management
            </Link>
            <Link
              to="/menu-management"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="mr-3 h-5 w-5"><FiCoffee /></span>
              Menu
            </Link>
            <Link
              to="/reports-management"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="mr-3 h-5 w-5"><FiBarChart2 /></span>
              Reports
            </Link>
          </div>

          <div className="mt-8">
            <div className="px-2">
              <div className="flex items-center px-2 py-2 text-sm text-gray-600">
                <div className="mr-3 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.role}</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="mt-3 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="mr-3 h-5 w-5"><FiLogOut /></span>
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <span className="h-6 w-6"><FiMenu /></span>
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900">Management Dashboard</h1>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Pusat Manajemen</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Kelola pengguna, menu, dan pantau kinerja bisnis restoran Anda
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white bg-indigo-600 border-indigo-500'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-400'
                  }`}>
                    {tab.icon}
                  </span>
                  <span className="ml-3 text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagementDashboard;
