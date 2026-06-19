import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCheckoutPayment } from '../hooks/useCheckoutPayment';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import ShippingAddressForm from '../components/ShippingAddressForm';
import type { ShippingAddress } from '../types';

export default function Checkout() {
  const { user } = useAuth();
  const {
    items,
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

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to checkout</h2>
        <Link to="/login" state={{ from: '/checkout' }} className="btn-primary inline-block">Login</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/shop" className="btn-primary inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          processPayment(address);
        }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <ShippingAddressForm value={address} onChange={handleAddressChange} />
          </div>

          <div className="card p-6">
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              razorpayEnabled={razorpayEnabled}
            />
          </div>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={`${item.product}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-dark-600">{item.name} x{item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {payButtonLabel()}
          </button>
          <Link to="/cart" className="block text-center text-primary-600 font-medium mt-3 hover:underline">
            Back to Cart
          </Link>
        </div>
      </form>
    </div>
  );
}
