import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { onImageError } from '../utils/image';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error('Out of stock');
      return;
    }
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price,
      quantity: 1,
      stock: product.stock,
    });
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/product/${product.slug}`} className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-dark-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={onImageError}
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-white p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500 hover:text-white"
        >
          <FiShoppingCart size={18} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-dark-400 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-semibold text-dark-800 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
          <span className="text-sm text-dark-500">{product.rating} ({product.numReviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-dark-900">₹{price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-sm text-dark-400 line-through">₹{product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
