import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { SITE } from '../constants/site';
import api from '../api/axios';
import { getApiError } from '../utils/apiError';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We will contact you within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Failed to send message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Contact Us</h1>
          <p className="text-dark-300 max-w-xl mx-auto">We'd love to hear from you. Reach out for orders, queries, or feedback.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div className="card p-6">
              <FiMapPin className="text-amber-500 mb-3" size={24} />
              <h3 className="font-bold text-dark-900 mb-2">Our Address</h3>
              <p className="text-dark-600">{SITE.address}</p>
            </div>
            <div className="card p-6">
              <FiPhone className="text-amber-500 mb-3" size={24} />
              <h3 className="font-bold text-dark-900 mb-2">Phone Number</h3>
              <a href={`tel:${SITE.phone}`} className="text-primary-600 font-semibold hover:underline">{SITE.phoneDisplay}</a>
            </div>
            <div className="card p-6">
              <FiMail className="text-amber-500 mb-3" size={24} />
              <h3 className="font-bold text-dark-900 mb-2">Email</h3>
              <a href={`mailto:${SITE.email}`} className="text-primary-600 hover:underline">{SITE.email}</a>
            </div>
            <div className="card p-6">
              <FiClock className="text-amber-500 mb-3" size={24} />
              <h3 className="font-bold text-dark-900 mb-2">Business Hours</h3>
              <p className="text-dark-600 text-sm">{SITE.hours}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <h2 className="text-2xl font-bold text-dark-900 mb-2">Send Us a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="8174966042" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required className="input-field">
                    <option value="">Select a topic</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Return/Refund">Return / Refund</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="input-field resize-none" placeholder="How can we help you?" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <FiSend size={18} /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
