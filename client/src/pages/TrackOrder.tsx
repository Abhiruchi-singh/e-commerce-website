import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiSearch, FiTruck, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { trackOrder, getMyOrders } from '../api/orders';
import type { Order } from '../types';
import Loading from '../components/Loading';
import { SITE } from '../constants/site';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function TrackOrder() {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      toast.error('Please enter Order ID and Email');
      return;
    }
    setLoading(true);
    setOrder(null);
    try {
      const data = await trackOrder(orderId.trim(), email.trim());
      setOrder(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const loadMyOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setMyOrders(data);
      setLoaded(true);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div>
      <section className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <FiPackage className="mx-auto text-amber-400 mb-4" size={40} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-dark-300 max-w-xl mx-auto">Enter your Order ID and email to track delivery status in real-time.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleTrack} className="card p-8 mb-10">
          <h2 className="text-xl font-bold text-dark-900 mb-6 flex items-center gap-2">
            <FiSearch /> Track by Order ID
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order ID *</label>
              <input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="input-field" placeholder="e.g. A5EF1234 or full ID" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {order && (
          <div className="card p-8 mb-10">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p className="text-sm text-dark-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-8 px-4">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1 relative">
                  {i > 0 && <div className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${i <= currentStep ? 'bg-green-500' : 'bg-dark-200'}`} style={{ right: '50%', width: '100%', zIndex: 0 }} />}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${i <= currentStep ? 'bg-green-500 text-white' : 'bg-dark-200 text-dark-500'}`}>
                    {i < currentStep ? <FiCheckCircle size={16} /> : <FiTruck size={14} />}
                  </div>
                  <span className="text-xs mt-2 capitalize font-medium text-dark-600">{step}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <Link to={`/orders/${order._id}`} className="text-primary-600 text-sm mt-4 inline-block hover:underline">View full order details →</Link>
          </div>
        )}

        {user ? (
          <div className="card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Orders</h2>
              {!loaded && (
                <button onClick={loadMyOrders} className="btn-primary text-sm">Load My Orders</button>
              )}
            </div>
            {loading && <Loading />}
            {loaded && myOrders.length === 0 && <p className="text-dark-500 text-center py-8">No orders yet. <Link to="/shop" className="text-primary-600 hover:underline">Start shopping</Link></p>}
            {myOrders.map((o) => (
              <Link key={o._id} to={`/orders/${o._id}`} className="block border rounded-lg p-4 mb-3 hover:shadow-md transition">
                <div className="flex justify-between">
                  <span className="font-semibold">#{o._id.slice(-8).toUpperCase()}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-sm text-dark-500 mt-1">{new Date(o.createdAt).toLocaleDateString()} · ₹{o.totalPrice.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-dark-600 mb-4">Login to view all your orders easily</p>
            <Link to="/login" className="btn-primary inline-block">Login / Sign Up</Link>
          </div>
        )}

        <div className="mt-10 card p-6 bg-amber-50 border-amber-200">
          <h3 className="font-bold text-dark-900 mb-2">Need Help?</h3>
          <p className="text-dark-600 text-sm mb-2">Contact our customer service team at <a href={`tel:${SITE.phone}`} className="text-primary-600 font-semibold">{SITE.phoneDisplay}</a></p>
          <Link to="/customer-service" className="text-primary-600 text-sm hover:underline">Visit Customer Service →</Link>
        </div>
      </section>
    </div>
  );
}
