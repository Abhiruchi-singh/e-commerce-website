import { Link } from 'react-router-dom';
import { SITE } from '../../constants/site';

interface LogoProps {
  variant?: 'header' | 'footer';
  showText?: boolean;
}

export default function Logo({ variant = 'header', showText = true }: LogoProps) {
  const isFooter = variant === 'footer';

  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div
        className={`relative flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 ${
          isFooter ? 'w-11 h-11' : 'w-12 h-12'
        }`}
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 45%, #b45309 100%)',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/25 to-transparent" />
        <svg viewBox="0 0 48 48" className={`${isFooter ? 'w-7 h-7' : 'w-8 h-8'} relative z-10`} fill="none">
          <path
            d="M14 34V18l10-6 10 6v16"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 34v-8h8v8"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 34h28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <div className="leading-tight">
          <span
            className={`font-extrabold tracking-tight block ${
              isFooter ? 'text-white text-lg' : 'text-dark-900 text-xl'
            }`}
            style={{ letterSpacing: '-0.02em' }}
          >
            {SITE.shortName}
            <span className="text-amber-500">.</span>
          </span>
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
              isFooter ? 'text-amber-400/90' : 'text-amber-600'
            }`}
          >
            India
          </span>
        </div>
      )}
    </Link>
  );
}
