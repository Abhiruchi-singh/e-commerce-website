import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants/site';
import { getApiError } from '../utils/apiError';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! Your account is saved in our database.');
      navigate(redirectTo);
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-amber-50 to-white">
      <div className="card w-full max-w-md p-8 shadow-xl border-amber-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-extrabold text-2xl">E</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Welcome Back</h1>
          <p className="text-dark-500 mt-1">Sign in to {SITE.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-dark-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-600 font-semibold hover:underline">Create Account</Link>
        </p>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg text-xs text-dark-600 border border-amber-100">
          <p className="font-semibold mb-1">Demo Accounts (saved in MongoDB):</p>
          <p>Admin: admin@ecommerce.com / admin123</p>
          <p>User: user@ecommerce.com / user123</p>
        </div>
      </div>
    </div>
  );
}
