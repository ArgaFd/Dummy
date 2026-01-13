import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuAPI, type MenuItem } from '../services/api';
import { CartSidebar, CheckoutModal, usePayment } from '../components/menu';

interface CartItem {
  id: number;
  quantity: number;
}

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(parseInt(tableNumber || '1'));
  const [activeCategory, setActiveCategory] = useState('semua');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'manual'>('qris');

  // Use the payment hook
  const { isProcessing, checkout } = usePayment({
    onSuccess: (result) => {
      if (!result.redirectUrl) {
        // Only reset for manual payment (QRIS will redirect)
        alert(result.message);
        setCart([]);
        setShowCart(false);
        setShowCheckout(false);
        setCustomerName('');
      }
    },
    onError: (error) => {
      alert(error);
    },
  });

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
    await checkout({
      tableNumber: selectedTableNumber,
      customerName,
      items: cart,
      paymentMethod,
    });
  };

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
                    🪑 Meja {selectedTableNumber}
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
                className={`group relative p-4 lg:p-6 rounded-2xl font-bold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 ${activeCategory === category.id
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

      {/* Cart Sidebar Component */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        menuItems={menuItems}
        tableNumber={tableNumber}
        onRemoveFromCart={removeFromCart}
        onCheckout={() => setShowCheckout(true)}
        totalAmount={totalAmount}
      />

      {/* Checkout Modal Component */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        menuItems={menuItems}
        totalAmount={totalAmount}
        tableNumber={selectedTableNumber}
        onTableNumberChange={setSelectedTableNumber}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        onCheckout={handleCheckout}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default MenuPage;
