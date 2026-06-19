import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export default function PageNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname === '/') return null;

  return (
    <div className="bg-dark-50/80 border-b border-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-dark-700 bg-white border border-dark-200 rounded-lg hover:bg-dark-50 hover:border-amber-300 hover:text-amber-700 transition shadow-sm"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-dark-700 bg-white border border-dark-200 rounded-lg hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 transition shadow-sm"
        >
          <FiHome size={16} />
          Home
        </Link>
      </div>
    </div>
  );
}
