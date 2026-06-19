import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { SITE } from '../../constants/site';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-dark-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
          <div className="mb-5">
            <Logo variant="footer" />
          </div>
            <p className="text-sm leading-relaxed">
              Online store for everyday fashion and gadgets. Based in Gurgaon, shipping nationwide.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop" className="hover:text-amber-400 transition">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
              <li><Link to="/shop?category=Clothing" className="hover:text-amber-400 transition">Clothing</Link></li>
              <li><Link to="/shop?category=Electronics" className="hover:text-amber-400 transition">Electronics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/track-order" className="hover:text-amber-400 transition">Track Order</Link></li>
              <li><Link to="/customer-service" className="hover:text-amber-400 transition">Help & FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact Support</Link></li>
              <li><Link to="/profile" className="hover:text-amber-400 transition">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-amber-400 transition">Shopping Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin size={16} className="text-amber-400 mt-0.5 shrink-0" />
                {SITE.address}
              </li>
              <li className="flex items-center gap-2">
                <FiPhone size={16} className="text-amber-400 shrink-0" />
                <a href={`tel:${SITE.phone}`} className="hover:text-amber-400 transition">{SITE.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2">
                <FiMail size={16} className="text-amber-400 shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-amber-400 transition">{SITE.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-amber-400 transition">About</Link>
            <Link to="/contact" className="hover:text-amber-400 transition">Contact</Link>
            <Link to="/customer-service" className="hover:text-amber-400 transition">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
