import React from 'react';
import { SlidersHorizontal, RotateCcw, DollarSign, Tag, ArrowUpDown } from 'lucide-react';
import { CONDITIONS } from '../data/initialProducts';
import { useMarketplace } from '../context/MarketplaceContext';

export default function FilterSidebar({ isMobile = false, onClose = () => {} }) {
  const {
    selectedCondition,
    setSelectedCondition,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    setSearchQuery,
    setSelectedCategory
  } = useMarketplace();

  const handlePriceChange = (field, val) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleResetFilters = () => {
    setSelectedCondition('All Conditions');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setSearchQuery('');
    setSelectedCategory('all');
    if (isMobile) onClose();
  };

  const hasActiveFilters = 
    selectedCondition !== 'All Conditions' || 
    priceRange.min !== '' || 
    priceRange.max !== '' || 
    sortBy !== 'newest';

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 ${isMobile ? '' : 'sticky top-36'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">Filter & Sort</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
        >
          <option value="newest">✨ Newest First</option>
          <option value="price-asc">💵 Price: Low to High</option>
          <option value="price-desc">💎 Price: High to Low</option>
          <option value="popular">🔥 Most Viewed</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Quick price chips */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <button
            onClick={() => setPriceRange({ min: '', max: 100 })}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Under $100
          </button>
          <button
            onClick={() => setPriceRange({ min: 100, max: 500 })}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            $100 - $500
          </button>
          <button
            onClick={() => setPriceRange({ min: 500, max: '' })}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            $500+
          </button>
        </div>
      </div>

      {/* Item Condition */}
      <div className="mb-6">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          Condition
        </label>
        <div className="space-y-1.5">
          {CONDITIONS.map((cond) => (
            <label
              key={cond}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs sm:text-sm text-slate-700"
            >
              <input
                type="radio"
                name="condition"
                checked={selectedCondition === cond}
                onChange={() => setSelectedCondition(cond)}
                className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 border-slate-300 rounded"
              />
              <span>{cond}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Safety & Easy Tips Card */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 text-xs">
        <p className="font-semibold text-indigo-950 mb-1">💡 Marketplace Tip</p>
        <p className="text-indigo-800/90 leading-relaxed text-[11px]">
          Always meet in public locations and verify items in person before completing payments.
        </p>
      </div>

    </div>
  );
}

