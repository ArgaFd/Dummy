import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiBarChart2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ReportsPage = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('daily');

  const reports = [
    { id: 'daily', label: 'Laporan Harian', description: 'Lihat pendapatan harian' },
    { id: 'weekly', label: 'Laporan Mingguan', description: 'Lihat pendapatan mingguan' },
    { id: 'monthly', label: 'Laporan Bulanan', description: 'Lihat pendapatan bulanan' },
    { id: 'popular', label: 'Menu Terpopuler', description: 'Menu yang paling laku' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/owner/management" className="flex items-center text-gray-600 hover:text-gray-900">
                <span className="mr-2"><FiArrowLeft /></span>
                Kembali ke Management
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Laporan Bisnis</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pilih Jenis Laporan</h2>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`bg-white p-6 rounded-lg shadow cursor-pointer border-2 transition-all ${
                    selectedReport === report.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${
                      selectedReport === report.id ? 'bg-indigo-600' : 'bg-gray-100'
                    }`}>
                      <span className={`h-6 w-6 ${
                        selectedReport === report.id ? 'text-white' : 'text-gray-600'
                      }`}>
                        <FiBarChart2 />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{report.label}</h3>
                      <p className="text-sm text-gray-500">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Report Content */}
            <div className="bg-white rounded-lg shadow p-6">
              {selectedReport === 'daily' && <DailyReport />}
              {selectedReport === 'weekly' && <WeeklyReport />}
              {selectedReport === 'monthly' && <MonthlyReport />}
              {selectedReport === 'popular' && <PopularMenuReport />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Daily Report Component
const DailyReport = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const reportData = {
    totalOrders: 45,
    totalRevenue: 1250000,
    totalCustomers: 38,
    averageOrderValue: 27778,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Laporan Harian</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{reportData.totalOrders}</div>
          <div className="text-sm text-gray-500">Total Pesanan</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">Rp {reportData.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Pendapatan</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{reportData.totalCustomers}</div>
          <div className="text-sm text-gray-500">Total Pelanggan</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">Rp {reportData.averageOrderValue.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Rata-rata Pesanan</div>
        </div>
      </div>
    </div>
  );
};

// Weekly Report Component
const WeeklyReport = () => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Laporan Mingguan</h3>
      <p className="text-gray-500">Fitur laporan mingguan akan segera tersedia</p>
    </div>
  );
};

// Monthly Report Component
const MonthlyReport = () => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Laporan Bulanan</h3>
      <p className="text-gray-500">Fitur laporan bulanan akan segera tersedia</p>
    </div>
  );
};

// Popular Menu Report Component
const PopularMenuReport = () => {
  const popularItems = [
    { name: 'Nasi Goreng', orders: 120, revenue: 1800000 },
    { name: 'Ayam Bakar', orders: 95, revenue: 1900000 },
    { name: 'Es Teh', orders: 200, revenue: 1000000 },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Terpopuler</h3>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Menu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Pesanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Pendapatan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {popularItems.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.orders}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Rp {item.revenue.toLocaleString()}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
