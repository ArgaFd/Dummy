import { useState, useEffect } from 'react';
import { paymentAPI, type Payment } from '../../services/api';

const PaymentListPage = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = async () => {
        try {
            const response = await paymentAPI.getAll();
            if (response.data.success) {
                // Adjust this if response structure is nested
                setPayments(response.data.data.payments || []);
                setError(null);
            }
        } catch (err) {
            console.error('Failed to fetch payments:', err);
            setError('Gagal memuat daftar pembayaran');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
        // Poll every 30 seconds
        const interval = setInterval(fetchPayments, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleConfirmPayment = async (id: number) => {
        try {
            const response = await paymentAPI.updateStatus(id, 'paid'); // or 'completed' depending on backend
            if (response.data.success) {
                fetchPayments();
            }
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Gagal konfirmasi pembayaran');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid':
            case 'completed':
            case 'settlement': return 'bg-green-100 text-green-800';
            case 'cancelled':
            case 'expire':
            case 'deny': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'qris': return 'QRIS / Digital';
            case 'manual': return 'Tunai / Manual';
            case 'cash': return 'Tunai';
            case 'midtrans_qris': return 'Digital (QRIS)';
            default: return method;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Daftar Pembayaran</h2>
                <button
                    onClick={fetchPayments}
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

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                    Belum ada data pembayaran
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{payment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Order #{payment.orderId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        Rp {(payment.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {getPaymentMethodLabel(payment.paymentMethod)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {payment.status === 'pending' && payment.paymentMethod === 'manual' && (
                                            <button
                                                onClick={() => handleConfirmPayment(payment.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Konfirmasi
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentListPage;
