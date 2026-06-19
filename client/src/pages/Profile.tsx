import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        ...(form.password ? { password: form.password } : {}),
      });
      toast.success('Profile updated!');
      setForm({ ...form, password: '' });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-dark-900 mb-2">My Profile</h1>
      <p className="text-dark-500 mb-8">
        Role: <span className="font-semibold capitalize">{user.role}</span>
        {user.customerType && (
          <> · Member: <span className="font-semibold capitalize">{user.customerType}</span></>
        )}
        {' · '}
        <Link to="/orders" className="text-primary-600 hover:underline">View Orders</Link>
      </p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Street</label>
              <input name="street" value={form.street} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input name="state" value={form.state} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input name="zipCode" value={form.zipCode} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password (leave blank to keep current)</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
