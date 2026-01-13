import { useState, useEffect } from 'react';
import { orderAPI, type Order } from '../../services/api';

const OrderListPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAll();
            if (response.data.success) {
                setOrders(response.data.data);
                setError(null);
            }
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError('Gagal memuat daftar pesanan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Poll every 15 seconds to keep orders fresh
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            const response = await orderAPI.updateStatus(orderId, newStatus);
            if (response.data.success) {
                fetchOrders();
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Gagal mengupdate status pesanan');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'Menunggu';
            case 'processing': return 'Diproses';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    const pastOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Daftar Pesanan Aktif</h2>
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {activeOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">Tidak ada pesanan aktif saat ini.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activeOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <span className="text-lg font-bold text-gray-900">Meja {order.tableNumber}</span>
                                    <div className="text-sm text-gray-500">#{order.id} • {order.customerName}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                            <div className="p-4">
                                <ul className="space-y-2 mb-4">
                                    {(order.items || []).map((item) => (
                                        <li key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-700">
                                                {item.quantity}x Menu #{item.menuId}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                Rp {(item.unitPrice * item.quantity).toLocaleString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Total</span>
                                    <span className="text-lg font-bold text-indigo-600">
                                        Rp {(order.totalAmount || 0).toLocaleString()}
                                    </span>
                                </div>
                                {/* Action Buttons */}
                                <div className="mt-4 flex space-x-2 pt-3 border-t border-gray-100">
                                    {order.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'processing')}
                                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                            >
                                                Proses
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                                            >
                                                Tolak
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'processing' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                        >
                                            Selesai Masak
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Pesanan</h3>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meja</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pastOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Meja {order.tableNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp {(order.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderListPage;
