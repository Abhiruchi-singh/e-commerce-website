import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiMapPin, FiPhone } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { SITE } from '../../constants/site';
import Logo from './Logo';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/shop?category=Clothing', label: 'Clothing' },
    { to: '/shop?category=Electronics', label: 'Electronics' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top info bar */}
      <div className="bg-dark-900 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <FiMapPin size={13} className="text-amber-400 shrink-0" />
              {SITE.address}
            </span>
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 hover:text-amber-400 transition">
              <FiPhone size={13} className="text-amber-400 shrink-0" />
              {SITE.phoneDisplay}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-amber-400 transition">About</Link>
            <Link to="/contact" className="hover:text-amber-400 transition">Contact</Link>
            <Link to="/track-order" className="hover:text-amber-400 transition">Track Order</Link>
            <Link to="/customer-service" className="hover:text-amber-400 transition hidden sm:inline">Customer Service</Link>
          </div>
        </div>
      </div>

      {/* Promo bar */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-center text-sm py-1.5 font-medium">
        Free delivery on orders above ₹499 | Use code <span className="font-bold">STYLE10</span> for 10% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 border-b border-dark-100">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-dark-600 hover:text-amber-600 font-medium transition-colors text-sm">
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-amber-600 font-semibold text-sm">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-dark-50 rounded-lg transition">
              <FiSearch size={20} />
            </button>

            {user ? (
              <div className="relative group">
                <Link to="/profile" className="p-2 hover:bg-dark-50 rounded-lg transition flex items-center gap-1">
                  <FiUser size={20} />
                  <span className="hidden lg:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                </Link>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/profile" className="block px-4 py-2.5 hover:bg-dark-50 text-sm">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2.5 hover:bg-dark-50 text-sm">My Orders</Link>
                  <Link to="/track-order" className="block px-4 py-2.5 hover:bg-dark-50 text-sm">Track Order</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 hover:bg-dark-50 text-sm text-red-600 flex items-center gap-2">
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-amber-600 border border-amber-500 rounded-lg hover:bg-amber-50 transition">
                <FiUser size={16} /> Login
              </Link>
            )}

            <Link to="/cart" className="p-2 hover:bg-dark-50 rounded-lg transition relative">
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-dark-50 rounded-lg transition lg:hidden">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field" autoFocus />
          </form>
        )}
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="block py-2.5 text-dark-700 font-medium border-b border-dark-50">
              {link.label}
            </Link>
          ))}
          <Link to="/track-order" onClick={() => setMenuOpen(false)} className="block py-2.5 text-dark-700 font-medium border-b border-dark-50">Track Order</Link>
          <Link to="/customer-service" onClick={() => setMenuOpen(false)} className="block py-2.5 text-dark-700 font-medium border-b border-dark-50">Customer Service</Link>
          {!user && (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2.5 text-amber-600 font-semibold">Login / Sign Up</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2.5 text-amber-600 font-semibold">Admin Panel</Link>
          )}
        </div>
      )}
    </header>
  );
}
