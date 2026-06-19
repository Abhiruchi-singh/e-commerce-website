import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getProducts, getCategories } from '../api/products';
import type { Product } from '../types';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    const params: Record<string, string | number> = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (searchParams.get('featured') === 'true') params.featured = 'true';

    getProducts(params)
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [category, search, sort, page, searchParams]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">Shop</h1>
        <p className="text-dark-500 mt-1">{total} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="card p-5 space-y-6 sticky top-24">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    !category ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-dark-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      category === cat ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-dark-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {search && (
            <p className="mb-4 text-dark-600">
              Showing results for: <span className="font-semibold">"{search}"</span>
            </p>
          )}

          {loading ? (
            <Loading />
          ) : loadError ? (
            <div className="text-center py-20 card">
              <p className="text-xl text-dark-700 mb-4">Could not load products. Server may still be starting.</p>
              <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-dark-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={`w-10 h-10 rounded-lg font-medium transition ${
                        p === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-100 hover:bg-dark-200 text-dark-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
