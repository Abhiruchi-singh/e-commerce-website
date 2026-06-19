import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, getOrder } from '../api/orders';
import type { Order } from '../types';
import { onImageError } from '../utils/image';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h2>
          <p className="text-sm text-dark-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" onError={onImageError} />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-dark-500">Qty: {item.quantity} · ₹{item.price.toLocaleString()}</p>
            </div>
            <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-6">
        <div>
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm text-dark-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
            {order.shippingAddress.country}<br />
            Phone: {order.shippingAddress.phone}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.itemsPrice.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.taxPrice.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span></div>
            <p className="text-dark-500 mt-2">
              Payment: {order.paymentMethod}
              {order.isPaid ? ' (Paid)' : order.paymentMethod === 'COD' ? ' (Pay on delivery)' : ' (Pending)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (id) {
      getOrder(id)
        .then(setSingleOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      getMyOrders()
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, user]);

  if (!user) return <Navigate to="/login" />;

  if (loading) return <Loading />;

  if (id && singleOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/orders" className="text-primary-600 hover:underline text-sm mb-4 inline-block">&larr; Back to Orders</Link>
        <OrderDetail order={singleOrder} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-dark-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-dark-500 mb-4">No orders yet</p>
          <Link to="/shop" className="btn-primary inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 block hover:shadow-md transition">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-dark-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{order.totalPrice.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize mt-1 ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-dark-500 mt-2">{order.orderItems.length} item(s)</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
