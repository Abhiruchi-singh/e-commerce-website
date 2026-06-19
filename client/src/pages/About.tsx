import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiGlobe, FiHeart } from 'react-icons/fi';
import { SITE } from '../constants/site';

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">Our story</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">{SITE.name}</h1>
          <p className="text-dark-300 max-w-2xl mx-auto text-lg">
            Started in {SITE.founded} from Gurgaon — we pick products that people actually use, not just what looks good in ads.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-dark-900 mb-6">Who we are</h2>
            <p className="text-dark-600 leading-relaxed mb-4">
              {SITE.name} is a small team based in Gurgaon. We started with weekend pop-ups in Sector 14
              and moved online when customers kept asking for home delivery.
            </p>
            <p className="text-dark-600 leading-relaxed mb-4">
              Today we ship clothing, electronics and accessories across India. Every product on the site
              is checked for quality before it goes live — no random listings.
            </p>
            <p className="text-dark-600 leading-relaxed">
              Office: <strong>{SITE.address}</strong>. Call us at {SITE.phoneDisplay} if you need help with an order.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FiAward, title: 'Checked stock', desc: 'We test before listing' },
              { icon: FiUsers, title: '2,400+ orders', desc: 'Since launch' },
              { icon: FiGlobe, title: 'Pan-India', desc: '3–7 day delivery' },
              { icon: FiHeart, title: 'Real support', desc: SITE.phoneDisplay },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:shadow-lg transition">
                <Icon className="mx-auto text-amber-500 mb-3" size={28} />
                <h3 className="font-bold text-dark-900 mb-1">{title}</h3>
                <p className="text-sm text-dark-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-dark-900 mb-10">What we care about</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Mission', text: 'Keep online shopping simple — clear prices, honest descriptions, quick support.' },
              { title: 'Vision', text: 'Build a trusted home-grown brand that competes with big marketplaces on service, not hype.' },
              { title: 'Values', text: 'Straight talk, fair pricing, and fixing problems fast when something goes wrong.' },
            ].map((item) => (
              <div key={item.title} className="card p-8 border-t-4 border-amber-500">
                <h3 className="text-xl font-bold text-dark-900 mb-3">{item.title}</h3>
                <p className="text-dark-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark-900 mb-4">Take a look around</h2>
        <p className="text-dark-500 mb-6">33 items live right now — new stock every month</p>
        <Link to="/shop" className="btn-primary inline-block">Go to shop</Link>
      </section>
    </div>
  );
}
