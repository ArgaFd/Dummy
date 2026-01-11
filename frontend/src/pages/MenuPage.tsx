import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { menuAPI, orderAPI, paymentAPI, type MenuItem } from '../services/api';

interface CartItem {
  id: number;
  quantity: number;
}

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [activeCategory, setActiveCategory] = useState('semua');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const categories = [
    { id: 'semua', name: 'Semua Menu', icon: '🍽️' },
    { id: 'makanan', name: 'Makanan', icon: '🍜' },
    { id: 'minuman', name: 'Minuman', icon: '🥤' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' }
  ];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const response = await menuAPI.getAll();
      if (response.data.success) {
        setMenuItems(response.data.data.items);
      }
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'semua' 
    ? menuItems.filter(item => item.is_available)
    : menuItems.filter(item => item.category === activeCategory && item.is_available);

  const addToCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { id: itemId, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      return prevCart.filter(item => item.id !== itemId);
    });
  };

  const totalAmount = cart.reduce((total, cartItem) => {
    const item = menuItems.find(i => i.id === cartItem.id);
    return total + (item ? item.price * cartItem.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert('Silakan masukkan nama pelanggan');
      return;
    }

    if (cart.length === 0) {
      alert('Keranjang masih kosong');
      return;
    }

    try {
      // Create order
      const orderData = {
        tableNumber: parseInt(tableNumber || '1'),
        customerName: customerName.trim(),
        items: cart.map(item => ({
          menuId: item.id,
          quantity: item.quantity
        }))
      };

      const orderResponse = await orderAPI.create(orderData);
      if (orderResponse.data.success) {
        const order = orderResponse.data.data;

        // Create payment
        const paymentData = {
          order_id: order.id,
          amount: order.total_amount,
          payment_method: 'cash'
        };

        const paymentResponse = await paymentAPI.create(paymentData);
        if (paymentResponse.data.success) {
          alert('Pesanan dan pembayaran berhasil diproses!');
          setCart([]);
          setShowCart(false);
          setShowCheckout(false);
          setCustomerName('');
        }
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Gagal memproses pesanan. Silakan coba lagi.');
    }
  };

  if (!tableNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Meja Tidak Dikenali</h2>
          <p className="mb-6">Silakan scan QR code yang tersedia di meja Anda</p>
          <Link 
            to="/scan" 
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kembali ke Scanner
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header - Desktop Fixed */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-2xl">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">Digital Menu</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">
                    🪑 Meja {tableNumber}
                  </span>
                  <span className="hidden lg:inline text-gray-400">•</span>
                  <span className="hidden lg:inline text-gray-600">{filteredItems.length} items available</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Desktop Cart Summary - Fixed */}
              <div className="hidden lg:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <span className="text-sm font-medium text-gray-600">Cart Total:</span>
                <span className="text-lg font-black text-orange-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cart.reduce((total, item) => total + item.quantity, 0)} items
                </span>
              </div>
              
              <button 
                onClick={() => setShowCart(true)}
                className="relative group bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-black rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Enhanced Categories - Desktop Fixed */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4 lg:mb-0">Browse Categories</h2>
            <div className="text-sm lg:text-base text-gray-600">
              {filteredItems.length} items found
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative p-4 lg:p-6 rounded-2xl font-bold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center space-y-2 lg:space-y-3">
                  <span className="text-2xl lg:text-3xl">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
                {activeCategory === category.id && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
          {/* Enhanced Menu Grid - Desktop Fixed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const cartItem = cart.find(cartItem => cartItem.id === item.id);
            const quantity = cartItem?.quantity || 0;
            
            return (
              <div key={item.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Image Placeholder - Desktop Fixed */}
                <div className="h-48 lg:h-56 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-red-200/20"></div>
                  <div className="text-6xl lg:text-7xl opacity-50">
                    {item.category === 'makanan' ? '🍜' : item.category === 'minuman' ? '🥤' : '🍰'}
                  </div>
                  {item.is_available && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Available
                    </div>
                  )}
                  {/* Desktop Hover Overlay - Fixed */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <div className="text-xl font-black mb-2">{item.name}</div>
                      <div className="text-lg font-bold">Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 lg:p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg lg:text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white px-3 py-1 rounded-full font-bold text-sm lg:text-base">
                      Rp {item.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm lg:text-base mb-4 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium hidden lg:inline">
                        {item.category}
                      </span>
                    </div>
                    
                    {quantity > 0 ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-black text-orange-600 text-lg">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 lg:px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Enhanced Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
              onClick={() => setShowCart(false)}
            />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-2xl">
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-xl">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900">Your Cart</h2>
                          <p className="text-sm text-gray-600">Meja {tableNumber}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowCart(false)}
                      >
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-gray-600 font-medium">Your cart is empty</p>
                        <p className="text-gray-400 text-sm mt-2">Add some delicious items!</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {cart.map(cartItem => {
                            const menuItem = menuItems.find(item => item.id === cartItem.id);
                            if (!menuItem) return null;
                            
                            return (
                              <div key={cartItem.id} className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <h4 className="font-black text-gray-900">{menuItem.name}</h4>
                                    <p className="text-sm text-gray-600">Rp {menuItem.price.toLocaleString('id-ID')} x {cartItem.quantity}</p>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className="font-black text-orange-600">
                                      Rp {(menuItem.price * cartItem.quantity).toLocaleString('id-ID')}
                                    </span>
                                    <button
                                      onClick={() => removeFromCart(cartItem.id)}
                                      className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-black text-gray-900">Total:</span>
                            <span className="text-2xl font-black text-orange-600">
                              Rp {totalAmount.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setShowCheckout(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">Checkout</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Customer
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">Order Summary:</h4>
                      <div className="space-y-2">
                        {cart.map(cartItem => {
                          const menuItem = menuItems.find(item => item.id === cartItem.id);
                          if (!menuItem) return null;
                          
                          return (
                            <div key={cartItem.id} className="flex justify-between text-sm">
                              <span>{menuItem.name} x {cartItem.quantity}</span>
                              <span>Rp {(menuItem.price * cartItem.quantity).toLocaleString('id-ID')}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between font-black text-lg">
                          <span>Total:</span>
                          <span className="text-orange-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-base font-black text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCheckout}
                  disabled={!customerName.trim()}
                >
                  Place Order
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCheckout(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
