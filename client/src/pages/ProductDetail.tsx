import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { onImageError } from '../utils/image';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    setProduct(null);
    getProduct(id)
      .then((p) => {
        setProduct(p);
        if (p.sizes?.length) setSelectedSize(p.sizes[0]);
        if (p.colors?.length) setSelectedColor(p.colors[0]);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('This product is no longer available.');
        } else {
          setError('Unable to load product. Please wait a moment and try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !product) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <p className="text-xl text-dark-800 mb-2">{error || 'Product not found'}</p>
        <p className="text-dark-500 mb-6">Browse our catalog to find something you like.</p>
        <Link to="/shop" className="btn-primary inline-block">Go to Shop</Link>
      </div>
    );
  }

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Out of stock');
      return;
    }
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl overflow-hidden bg-dark-50">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={onImageError} />
        </div>

        <div>
          <p className="text-sm text-primary-600 font-medium uppercase tracking-wide mb-2">
            {product.category} · {product.brand}
          </p>
          <h1 className="text-3xl font-bold text-dark-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-dark-200'}
                />
              ))}
            </div>
            <span className="text-sm text-dark-500">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-dark-900">₹{price.toLocaleString()}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-dark-400 line-through">₹{product.price.toLocaleString()}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                  {Math.round(((product.price - product.salePrice!) / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-dark-600 leading-relaxed mb-6">{product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-dark-200 hover:border-dark-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-dark-200 hover:border-dark-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-dark-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-dark-50 transition"
              >
                <FiMinus size={16} />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-dark-50 transition"
              >
                <FiPlus size={16} />
              </button>
            </div>
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button onClick={handleAddToCart} disabled={product.stock <= 0} className="btn-primary w-full flex items-center justify-center gap-2 text-lg mb-4">
            <FiShoppingCart size={20} /> Add to Cart
          </button>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-dark-600">
              <FiTruck className="text-primary-600" /> Free shipping above ₹500
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-600">
              <FiShield className="text-primary-600" /> Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
