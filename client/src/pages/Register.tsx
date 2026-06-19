import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants/site';
import { getApiError } from '../utils/apiError';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Your email & password are saved permanently.');
      navigate('/');
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Registration failed'));
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
          <h1 className="text-2xl font-bold text-dark-900">Create Account</h1>
          <p className="text-dark-500 mt-1">Join {SITE.name} today</p>
          <p className="text-xs text-dark-400 mt-2">Your account is securely stored in MongoDB database</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password (min 6 characters)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating Account...' : 'Sign Up — Save My Account'}
          </button>
        </form>

        <p className="text-center text-sm text-dark-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
