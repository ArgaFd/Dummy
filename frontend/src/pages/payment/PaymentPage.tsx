import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderAPI, paymentAPI } from '../../services/api';

interface PaymentPageProps {}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData, paymentMethod, totalAmount } = location.state || {
    orderData: null,
    paymentMethod: 'qris',
    totalAmount: 0
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [orderId, setOrderId] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    if (!orderData) {
      navigate('/menu');
      return;
    }

    if (paymentMethod === 'qris') {
      processPayment();
    } else {
      createManualOrder();
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && paymentMethod === 'qris') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && paymentMethod === 'qris') {
      handlePaymentTimeout();
    }
  }, [timeLeft, paymentMethod]);

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      // Create order first
      const orderResponse = await orderAPI.createGuest(orderData);
      if (orderResponse.data.success) {
        const order = orderResponse.data.data;
        setOrderId(order.id);
        setOrderCreated(true);

        // Process payment
        const paymentResponse = await paymentAPI.guestQris({
          orderId: order.id,
          customer: {
            first_name: orderData.customerName,
          },
        });

        if (paymentResponse.data.success) {
          const redirectUrl = paymentResponse.data.data?.midtrans?.redirect_url;
          if (redirectUrl) {
            setPaymentUrl(redirectUrl);
          } else {
            alert('Gagal memulai pembayaran QRIS. Silakan coba lagi.');
            navigate('/menu');
          }
        }
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('Gagal memproses pembayaran. Silakan coba lagi.');
      navigate('/menu');
    } finally {
      setIsProcessing(false);
    }
  };

  const createManualOrder = async () => {
    setIsProcessing(true);
    try {
      const orderResponse = await orderAPI.createGuest(orderData);
      if (orderResponse.data.success) {
        const order = orderResponse.data.data;
        setOrderId(order.id);
        setOrderCreated(true);

        // Create manual payment
        const paymentResponse = await paymentAPI.guestManual({ orderId: order.id });
        if (paymentResponse.data.success) {
          // Navigate to order status
          navigate('/order-status', {
            state: {
              orderId: order.id,
              paymentMethod: 'manual'
            }
          });
        }
      }
    } catch (error) {
      console.error('Manual order creation failed:', error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
      navigate('/menu');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentTimeout = () => {
    alert('Waktu pembayaran habis. Silakan coba lagi.');
    navigate('/menu');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentComplete = () => {
    navigate('/order-status', {
      state: {
        orderId,
        paymentMethod
      }
    });
  };

  if (isProcessing && !orderCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Memproses pembayaran...</p>
        </div>
      </div>
    );
  }

  if (paymentMethod === 'manual' && orderCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Pesanan Berhasil!</h1>
          <p className="text-gray-600 mb-6">
            Pesanan Anda telah dibuat. Silakan lakukan pembayaran ke kasir.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Nomor Pesanan: #{orderId}
          </p>
          <button
            onClick={() => navigate('/order-status', {
              state: { orderId, paymentMethod: 'manual' }
            })}
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-full font-black hover:shadow-lg transition-all duration-300"
          >
            Lihat Status Pesanan
          </button>
        </div>
      </div>
    );
  }

  if (paymentMethod === 'qris' && paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-8 text-white">
              <h1 className="text-3xl font-black">Pembayaran QRIS</h1>
              <p className="text-white/90 mt-2">Selesaikan pembayaran dalam {formatTime(timeLeft)}</p>
            </div>

            <div className="p-8">
              {/* Payment Timer */}
              <div className="text-center mb-8">
                <div className={`text-5xl font-black ${timeLeft < 60 ? 'text-red-600' : 'text-orange-600'}`}>
                  {formatTime(timeLeft)}
                </div>
                <p className="text-gray-600 mt-2">Waktu tersisa</p>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-2xl p-8 mb-8">
                <div className="text-center">
                  <div className="bg-white p-8 rounded-xl inline-block">
                    <div className="w-64 h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📱</div>
                        <p className="text-gray-600">QR Code akan muncul di sini</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">Scan QR Code dengan aplikasi e-wallet Anda</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-black text-gray-900 mb-4">Detail Pesanan</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nomor Pesanan:</span>
                    <span className="font-black">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pembayaran:</span>
                    <span className="font-black text-orange-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.open(paymentUrl, '_blank')}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all duration-300"
                >
                  Buka Halaman Pembayaran
                </button>
                
                <button
                  onClick={handlePaymentComplete}
                  className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Saya Sudah Bayar
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/menu')}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Batalkan Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-black text-gray-900 mb-4">Terjadi Kesalahan</h1>
        <p className="text-gray-600 mb-8">Silakan coba lagi atau hubungi pelayan</p>
        <button
          onClick={() => navigate('/menu')}
          className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-full font-black hover:shadow-lg transition-all duration-300"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
