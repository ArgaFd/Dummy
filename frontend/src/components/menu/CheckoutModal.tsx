import { type MenuItem } from '../../services/api';

interface CartItem {
    id: number;
    quantity: number;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    menuItems: MenuItem[];
    totalAmount: number;
    tableNumber: number;
    onTableNumberChange: (value: number) => void;
    customerName: string;
    onCustomerNameChange: (value: string) => void;
    paymentMethod: 'qris' | 'manual';
    onPaymentMethodChange: (method: 'qris' | 'manual') => void;
    onCheckout: () => void;
    isProcessing?: boolean;
}

const CheckoutModal = ({
    isOpen,
    onClose,
    cart,
    menuItems,
    totalAmount,
    tableNumber,
    onTableNumberChange,
    customerName,
    onCustomerNameChange,
    paymentMethod,
    onPaymentMethodChange,
    onCheckout,
    isProcessing = false,
}: CheckoutModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-2xl font-black text-gray-900 mb-6">Checkout</h3>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor Meja
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={tableNumber}
                                        onChange={(e) => onTableNumberChange(parseInt(e.target.value || '1'))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4"
                                        placeholder="Masukkan nomor meja"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Customer
                                    </label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => onCustomerNameChange(e.target.value)}
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

                                <div className="mb-2">
                                    <h4 className="font-bold text-gray-900 mb-3">Metode Pembayaran</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onPaymentMethodChange('qris')}
                                            className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === 'qris'
                                                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="font-black text-gray-900">Digital Payment</div>
                                            <div className="text-xs text-gray-600 mt-1">QRIS, Kartu Kredit, GoPay, dll.</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onPaymentMethodChange('manual')}
                                            className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === 'manual'
                                                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="font-black text-gray-900">Manual</div>
                                            <div className="text-xs text-gray-600 mt-1">Bayar ke kasir</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-md px-6 py-3 text-base font-black text-white transition-all duration-200 sm:w-auto sm:text-sm ${(isProcessing || !customerName.trim())
                                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                : 'bg-orange-600 hover:bg-orange-700 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg transform hover:scale-105 active:scale-95'
                                }`}
                            onClick={onCheckout}
                            disabled={isProcessing || !customerName.trim()}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                paymentMethod === 'qris' ? 'Lanjut ke Pembayaran' : 'Buat Pesanan'
                            )}
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
