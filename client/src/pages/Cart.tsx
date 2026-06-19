import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiLock, FiShield } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCheckoutPayment } from '../hooks/useCheckoutPayment';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import ShippingAddressForm from '../components/ShippingAddressForm';
import { onImageError } from '../utils/image';
import type { ShippingAddress } from '../types';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalItems } = useCart();
  const { user } = useAuth();
  const {
    totalPrice,
    shipping,
    tax,
    grandTotal,
    loading,
    razorpayEnabled,
    paymentMethod,
    setPaymentMethod,
    processPayment,
    payButtonLabel,
  } = useCheckoutPayment();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    phone: user?.phone || '',
  });

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    processPayment(address);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <FiShoppingBag className="mx-auto text-dark-300 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-dark-800 mb-2">Your cart is empty</h2>
        <p className="text-dark-500 mb-6">Add some products to get started!</p>
        <Link to="/shop" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-dark-900 mb-2">Shopping Cart</h1>
      <p className="text-dark-500 mb-8">{totalItems} items · Payment yahin se complete karein</p>

      <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product}-${item.size}-${item.color}`} className="card p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" onError={onImageError} />
              <div className="flex-1">
                <h3 className="font-semibold text-dark-800">{item.name}</h3>
                {(item.size || item.color) && (
                  <p className="text-sm text-dark-500 mt-1">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' · '}
                    {item.color && `Color: ${item.color}`}
                  </p>
                )}
                <p className="text-lg font-bold text-dark-900 mt-2">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product, item.size, item.color)}
                  className="text-red-500 hover:text-red-700 transition p-1"
                >
                  <FiTrash2 size={18} />
                </button>
                <div className="flex items-center border border-dark-200 rounded-lg">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product, item.quantity - 1, item.size, item.color)}
                    className="p-2 hover:bg-dark-50"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product, item.quantity + 1, item.size, item.color)}
                    className="p-2 hover:bg-dark-50"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <p className="font-bold text-dark-900">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}

          {user ? (
            <div className="card p-6">
              <ShippingAddressForm value={address} onChange={handleAddressChange} compact />
            </div>
          ) : (
            <div className="card p-6 text-center bg-primary-50 border-primary-200">
              <FiLock className="mx-auto text-primary-600 mb-3" size={28} />
              <h3 className="font-bold text-dark-900 mb-1">Login required for payment</h3>
              <p className="text-sm text-dark-600 mb-4">Order place karne ke liye pehle account se login karein</p>
              <Link to="/login" state={{ from: '/cart' }} className="btn-primary inline-block">
                Login to Pay
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Tax (5%)</span>
                <span className="font-medium">₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
                razorpayEnabled={razorpayEnabled}
              />
            </div>

            {user ? (
              <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
                {payButtonLabel()}
              </button>
            ) : (
              <Link to="/login" state={{ from: '/cart' }} className="btn-primary w-full block text-center mt-6">
                Login to Pay ₹{grandTotal.toLocaleString()}
              </Link>
            )}

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-dark-500">
              <FiShield size={14} />
              <span>100% secure payment · Razorpay encrypted</span>
            </div>

            <Link to="/shop" className="block text-center text-primary-600 font-medium mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
