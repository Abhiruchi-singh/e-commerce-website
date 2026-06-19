import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiStar } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getProducts } from '../api/products';
import { SITE } from '../constants/site';
import type { Product } from '../types';
import { onImageError } from '../utils/image';

function ProductSection({
  title,
  subtitle,
  products,
  categoryLink,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  categoryLink: string;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-dark-900">{title}</h2>
          <p className="text-dark-500 mt-1">{subtitle}</p>
        </div>
        <Link to={categoryLink} className="text-amber-600 font-semibold hover:underline flex items-center gap-1">
          View All <FiArrowRight />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [clothing, setClothing] = useState<Product[]>([]);
  const [electronics, setElectronics] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: 'true', limit: 8 }),
      getProducts({ category: 'Clothing', limit: 7 }),
      getProducts({ category: 'Electronics', limit: 7 }),
    ])
      .then(([featuredRes, clothingRes, electronicsRes]) => {
        setFeatured(featuredRes.products);
        setClothing(clothingRes.products);
        setElectronics(electronicsRes.products);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative premium-gradient text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <FiStar className="text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold tracking-widest uppercase">New stock this week</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Shop smart at{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                {SITE.shortName}
              </span>
            </h1>
            <p className="text-lg text-dark-300 mb-4 leading-relaxed">
              {SITE.tagline} — handpicked from brands we trust. Delivery across India.
            </p>
            <p className="text-sm text-dark-400 mb-8 flex items-center gap-2">
              📍 {SITE.address} &nbsp;|&nbsp; 📞 {SITE.phoneDisplay}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/about" className="btn-outline border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-dark-900 inline-flex items-center gap-2 text-lg">
                About Us
              </Link>
              <Link to="/contact" className="text-amber-300 hover:text-amber-200 font-semibold inline-flex items-center gap-2 text-lg underline underline-offset-4">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹500' },
            { icon: FiShield, title: 'Secure Payment', desc: 'Razorpay protected checkout' },
            { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: FiHeadphones, title: '24/7 Support', desc: SITE.phoneDisplay },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6 card hover:shadow-lg hover:border-amber-200 transition">
              <Icon className="mx-auto text-amber-500 mb-3" size={28} />
              <h3 className="font-semibold text-dark-800 mb-1">{title}</h3>
              <p className="text-sm text-dark-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="py-12"><Loading /></div>
      ) : loadError ? (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center card">
          <p className="text-dark-700 mb-4">Products are loading. The server may still be starting up.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      ) : (
        <>
          <ProductSection
            title="Featured Products"
            subtitle="Picked for you — fashion, tech & more"
            products={featured}
            categoryLink="/shop"
          />
          <div className="bg-dark-50">
            <ProductSection
              title="Clothing Collection"
              subtitle="7 premium styles — shirts, dresses, ethnic wear & more"
              products={clothing}
              categoryLink="/shop?category=Clothing"
            />
          </div>
          <ProductSection
            title="Electronics"
            subtitle="7 top gadgets — audio, smart devices & accessories"
            products={electronics}
            categoryLink="/shop?category=Electronics"
          />
        </>
      )}

      <section className="bg-dark-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-dark-900 text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Clothing', img: '/products/formal-white-shirt.jpg?v=18', cat: 'Clothing' },
              { name: 'Electronics', img: '/products/4k-smart-tv-43.jpg?v=18', cat: 'Electronics' },
              { name: 'Footwear', img: '/products/leather-formal-shoes.jpg?v=18', cat: 'Footwear' },
              { name: 'Accessories', img: '/products/stainless-steel-water-bottle.jpg?v=18', cat: 'Accessories' },
            ].map((c) => (
              <Link key={c.cat} to={`/shop?category=${c.cat}`} className="relative rounded-xl overflow-hidden group aspect-[4/3] shadow-md">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={onImageError} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent flex items-end justify-center pb-6">
                  <h3 className="text-white text-xl font-bold">{c.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
