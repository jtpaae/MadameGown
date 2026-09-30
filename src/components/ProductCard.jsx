import React from 'react';
import { Heart, MapPin, Star, ShieldCheck, Eye } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function ProductCard({ product }) {
  const { favorites, toggleFavorite, setActiveProduct, addToCart } = useMarketplace();
  const isFavorited = favorites.includes(product.id);

  // Format relative time or clean date
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      onClick={() => setActiveProduct(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Top Badges: Condition & Favorite Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 shadow-xs pointer-events-auto backdrop-blur-xs">
            {product.condition}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`p-2 rounded-full shadow-md transition-transform active:scale-90 pointer-events-auto backdrop-blur-md ${
              isFavorited
                ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
            title={isFavorited ? 'Remove from saved' : 'Save item'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bottom overlay: Price & Views */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white pointer-events-none">
          <span className="text-xl font-extrabold tracking-tight drop-shadow-md">
            ${product.price.toLocaleString()}
          </span>
          {product.views && (
            <span className="text-[11px] font-medium opacity-90 flex items-center gap-1 drop-shadow-sm">
              <Eye className="w-3 h-3" />
              {product.views}
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold tracking-wide uppercase text-indigo-600">
              {product.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-400">
              {formatTime(product.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>

        {/* Seller Info & Quick Actions Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-700 truncate max-w-[100px]">
                  {product.seller.name}
                </span>
                {product.seller.verified && (
                  <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" title="Verified Seller" />
                )}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.seller.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

