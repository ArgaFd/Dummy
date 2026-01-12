import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';

interface Order {
  id: string;
  table_number: number;
  customer_name: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  created_at: string;
  estimated_time?: number;
}

const StaffPortal: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'cooking' | 'ready'>('all');

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      const ordersData = (response.data.data as any)?.items || response.data.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(parseInt(orderId), newStatus);
      loadOrders(); // Refresh orders
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Gagal mengupdate status pesanan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cooking':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'processing':
        return 'Diproses';
      case 'cooking':
        return 'Dimasak';
      case 'ready':
        return 'Siap';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'cooking';
      case 'cooking':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return currentStatus;
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Terima Pesanan';
      case 'processing':
        return 'Mulai Memasak';
      case 'cooking':
        return 'Selesai Memasak';
      case 'ready':
        return 'Selesaikan Pesanan';
      default:
        return '';
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    cooking: orders.filter(o => o.status === 'cooking').length,
    ready: orders.filter(o => o.status === 'ready').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
              <p className="text-gray-600 mt-1">Kelola pesanan restoran</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={loadOrders}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'all', label: 'Semua', count: orderCounts.all },
                { key: 'pending', label: 'Menunggu', count: orderCounts.pending },
                { key: 'processing', label: 'Diproses', count: orderCounts.processing },
                { key: 'cooking', label: 'Dimasak', count: orderCounts.cooking },
                { key: 'ready', label: 'Siap', count: orderCounts.ready }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">Pesanan #{order.id}</h3>
                    <p className="text-blue-100">Meja {order.table_number}</p>
                    <p className="text-blue-100">{order.customer_name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Detail Pesanan:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {order.estimated_time && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Estimasi waktu: {order.estimated_time} menit
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Action Button */}
                {order.status !== 'completed' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {getActionText(order.status)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pesanan</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Belum ada pesanan saat ini' 
                : `Tidak ada pesanan dengan status ${getStatusText(filter)}`
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffPortal;
