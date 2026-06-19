import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { getAllOrders, updateOrderStatus } from '../api/orders';
import type { Product, Order } from '../types';
import { onImageError } from '../utils/image';

const emptyProduct = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  salePrice: 0,
  category: 'Clothing',
  brand: 'StyleHub',
  image: '',
  stock: 0,
  featured: false,
};

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, orderData] = await Promise.all([
        getProducts({ limit: 100 }),
        getAllOrders(),
      ]);
      setProducts(prodData.products);
      setOrders(orderData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') loadData();
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
    const data = { ...form, slug, salePrice: form.salePrice || undefined };

    try {
      if (editingId) {
        await updateProduct(editingId, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyProduct);
      loadData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Failed to save');
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice || 0,
      category: product.category,
      brand: product.brand,
      image: product.image,
      stock: product.stock,
      featured: product.featured,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      loadData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-dark-900 mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 rounded-lg font-medium transition ${tab === 'products' ? 'bg-primary-600 text-white' : 'bg-dark-100'}`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 rounded-lg font-medium transition ${tab === 'orders' ? 'bg-primary-600 text-white' : 'bg-dark-100'}`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Manage Products</h2>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyProduct); }}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Add Product
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="card p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
              <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
              <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="input-field" />
              <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
              <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="input-field" />
              <input type="number" placeholder="Sale Price" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })} className="input-field" />
              <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required className="input-field" />
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required className="input-field sm:col-span-2" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="input-field sm:col-span-2" rows={3} />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-50">
                <tr>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" onError={onImageError} />
                      {p.name}
                    </td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">₹{(p.salePrice || p.price).toLocaleString()}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-dark-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <p className="font-bold text-lg">₹{order.totalPrice.toLocaleString()}</p>
              </div>
              <p className="text-sm text-dark-600 mb-3">{order.orderItems.length} items · {order.shippingAddress.fullName}</p>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="input-field w-auto text-sm"
              >
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
