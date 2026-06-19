import { Link } from 'react-router-dom';
import { FiHelpCircle, FiRefreshCw, FiCreditCard, FiTruck, FiShield, FiMessageCircle } from 'react-icons/fi';
import { SITE } from '../constants/site';

const faqs = [
  { q: 'How do I place an order?', a: 'Browse products, add to cart, proceed to checkout, fill shipping details and place your order. You will receive an order confirmation.' },
  { q: 'What payment methods are accepted?', a: 'We accept Cash on Delivery (COD) and secure online payments via Razorpay (UPI, Credit/Debit Cards, Net Banking). All online transactions are encrypted and 100% secure.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days. Express delivery (1-3 days) is available for select locations.' },
  { q: 'What is the return policy?', a: 'We offer a 30-day hassle-free return policy on most products. Items must be unused and in original packaging.' },
  { q: 'Is shipping free?', a: 'Yes! Free shipping on all orders above ₹500. Orders below ₹500 have a flat ₹49 shipping charge.' },
  { q: 'How do I track my order?', a: 'Visit the Track Order page, enter your Order ID and registered email. You can also login and view all orders in My Account.' },
  { q: 'How do I create an account?', a: 'Click Login/Sign Up, fill in your name, email and password. Your account is saved permanently in our database.' },
  { q: 'Who do I contact for support?', a: `Call us at ${SITE.phoneDisplay} or email ${SITE.email}. Our team is available ${SITE.hours}.` },
];

export default function CustomerService() {
  return (
    <div>
      <section className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <FiHelpCircle className="mx-auto text-amber-400 mb-4" size={40} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Service</h1>
          <p className="text-dark-300 max-w-xl mx-auto">We're here to help with orders, returns, payments and everything in between.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {[
            { icon: FiTruck, label: 'Track Order', to: '/track-order' },
            { icon: FiRefreshCw, label: 'Returns', to: '/contact' },
            { icon: FiCreditCard, label: 'Payments', to: '/contact' },
            { icon: FiShield, label: 'Security', to: '/about' },
            { icon: FiMessageCircle, label: 'Contact Us', to: '/contact' },
            { icon: FiHelpCircle, label: 'FAQs', to: '#faqs' },
          ].map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="card p-5 text-center hover:shadow-lg hover:border-amber-300 transition group">
              <Icon className="mx-auto text-amber-500 mb-2 group-hover:scale-110 transition" size={24} />
              <span className="text-sm font-semibold text-dark-800">{label}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="card p-8 border-t-4 border-amber-500">
            <h3 className="text-xl font-bold mb-4">Shipping Policy</h3>
            <ul className="text-dark-600 text-sm space-y-2">
              <li>• Free shipping on orders above ₹500</li>
              <li>• Standard delivery: 3-7 business days</li>
              <li>• Pan-India delivery available</li>
              <li>• Order tracking via Track Order page</li>
              <li>• SMS & email updates on dispatch</li>
            </ul>
          </div>
          <div className="card p-8 border-t-4 border-amber-500">
            <h3 className="text-xl font-bold mb-4">Return & Refund</h3>
            <ul className="text-dark-600 text-sm space-y-2">
              <li>• 30-day return window</li>
              <li>• Full refund for defective items</li>
              <li>• Exchange available for size issues</li>
              <li>• Refund processed within 5-7 days</li>
              <li>• Contact us to initiate a return</li>
            </ul>
          </div>
          <div className="card p-8 border-t-4 border-amber-500">
            <h3 className="text-xl font-bold mb-4">Contact Support</h3>
            <div className="text-dark-600 text-sm space-y-3">
              <p><strong>Address:</strong> {SITE.address}</p>
              <p><strong>Phone:</strong> <a href={`tel:${SITE.phone}`} className="text-primary-600">{SITE.phoneDisplay}</a></p>
              <p><strong>Email:</strong> <a href={`mailto:${SITE.email}`} className="text-primary-600">{SITE.email}</a></p>
              <p><strong>Hours:</strong> {SITE.hours}</p>
              <Link to="/contact" className="btn-primary inline-block text-sm mt-2">Send Message</Link>
            </div>
          </div>
        </div>

        <div id="faqs">
          <h2 className="text-3xl font-bold text-dark-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="card group">
                <summary className="p-5 font-semibold text-dark-900 cursor-pointer hover:text-amber-600 transition list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-amber-500 group-open:rotate-45 transition text-xl">+</span>
                </summary>
                <p className="px-5 pb-5 text-dark-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
