import React from 'react';
import { 
  Search, 
  PlusCircle, 
  Heart, 
  ShoppingBag, 
  MapPin, 
  X,
  Sparkles
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Navbar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    favorites, 
    cart, 
    setIsCartOpen, 
    setIsCreateModalOpen,
    setSelectedCategory
  } = useMarketplace();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Easy<span className="text-indigo-600">Market</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Draft v1
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Buy & Sell with Ease</p>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, vintage chairs, bikes, electronics..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Sell CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Pill (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Greater Metro Area</span>
            </div>

            {/* Saved / Favorites */}
            <button
              title="Saved Items"
              onClick={() => {}}
              className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart / Inquiries */}
            <button
              onClick={() => setIsCartOpen(true)}
              title="Cart & Inquiries"
              className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* + Sell an Item Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Sell Item</span>
              <span className="xs:hidden">Sell</span>
            </button>

            {/* User Avatar */}
            <div className="hidden sm:flex items-center ml-1 pl-2 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/20 object-cover"
              />
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

