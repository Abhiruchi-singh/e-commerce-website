import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';
import { createRazorpayOrder, getPaymentConfig } from '../api/payment';
import { loadRazorpayScript } from '../utils/razorpay';
import { computeOrderTotals } from '../utils/orderTotals';
import type { PaymentMethod } from '../components/PaymentMethodSelector';
import type { CartItem, ShippingAddress } from '../types';

const isOnlineMethod = (method: PaymentMethod) => method === 'UPI' || method === 'Card';

export function useCheckoutPayment() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const { shipping, tax, grandTotal } = computeOrderTotals(totalPrice);

  useEffect(() => {
    getPaymentConfig()
      .then((config) => {
        setRazorpayEnabled(config.enabled);
        if (!config.enabled && paymentMethod !== 'COD') {
          setPaymentMethod('COD');
        }
      })
      .catch(() => setRazorpayEnabled(false));
  }, []);

  const buildOrderPayload = (address: ShippingAddress, method: PaymentMethod) => ({
    orderItems: items.map((i: CartItem) => ({
      product: i.product,
      name: i.name,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      stock: i.stock,
    })),
    shippingAddress: address,
    paymentMethod: method,
  });

  const placeOrder = async (
    address: ShippingAddress,
    method: PaymentMethod,
    paymentDetails?: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string },
  ) => {
    const order = await createOrder({
      ...buildOrderPayload(address, method),
      ...paymentDetails,
    });
    clearCart();
    const successMsg =
      method === 'COD'
        ? 'Order placed! Pay cash on delivery.'
        : method === 'UPI'
          ? 'UPI payment successful! Order confirmed.'
          : 'Payment successful! Order placed.';
    toast.success(successMsg);
    navigate(`/orders/${order._id}`);
  };

  const openRazorpay = async (address: ShippingAddress, method: PaymentMethod) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Payment gateway load nahi ho paya. COD try karein.');
      return;
    }

    const config = await getPaymentConfig();
    if (!config.enabled || !config.keyId) {
      toast.error('Online payment abhi available nahi hai. COD use karein.');
      return;
    }

    const razorpayOrder = await createRazorpayOrder(grandTotal);

    return new Promise<void>((resolve, reject) => {
      const options: Record<string, unknown> = {
        key: config.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'StyleHub India',
        description: method === 'UPI' ? 'UPI Payment' : 'Card / Net Banking Payment',
        order_id: razorpayOrder.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await placeOrder(address, method, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: address.phone,
        },
        theme: { color: '#ea580c' },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancel ho gaya');
            reject(new Error('Payment cancelled'));
          },
        },
      };

      if (method === 'UPI') {
        options.method = { upi: true, card: false, netbanking: false, wallet: false };
      } else if (method === 'Card') {
        options.method = { upi: false, card: true, netbanking: true, wallet: true };
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(response.error.description || 'Payment fail ho gaya');
        reject(new Error('Payment failed'));
      });
      rzp.open();
    });
  };

  const processPayment = async (address: ShippingAddress) => {
    if (!user) {
      toast.error('Payment ke liye pehle login karein');
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      toast.error('Cart khali hai');
      return;
    }

    setLoading(true);
    try {
      if (isOnlineMethod(paymentMethod)) {
        await openRazorpay(address, paymentMethod);
      } else {
        await placeOrder(address, paymentMethod);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order place nahi ho paya';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        toast.error(axiosErr.response?.data?.message || message);
      } else if (message !== 'Payment cancelled' && message !== 'Payment failed') {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const payButtonLabel = () => {
    if (loading) return 'Processing Payment...';
    if (paymentMethod === 'COD') return `Place Order · ₹${grandTotal.toLocaleString()}`;
    if (paymentMethod === 'UPI') return `Pay with UPI · ₹${grandTotal.toLocaleString()}`;
    return `Pay Online · ₹${grandTotal.toLocaleString()}`;
  };

  return {
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
    user,
  };
}
