import React, { useState } from 'react';
import { SlidersHorizontal, PackageSearch, Sparkles, X } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import { useMarketplace } from '../context/MarketplaceContext';

export default function ProductGrid() {
  const { filteredProducts, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, setSelectedCondition, setPriceRange } = useMarketplace();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('All Conditions');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Grid Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Marketplace Feed</span>
            {searchQuery && (
              <span className="text-sm font-normal text-slate-500">
                matching "{searchQuery}"
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing <span className="font-semibold text-slate-800">{filteredProducts.length}</span> verified listings
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-50"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
          <span>Filters & Sort</span>
        </button>
      </div>

      {/* Main Layout: Sidebar (Desktop) + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar />
        </div>

        {/* Products Grid or Empty State */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No items match your search</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5">
                We couldn't find any listings matching your current criteria. Try broadening your keywords, clearing filters, or posting the item yourself!
              </p>
              <button
                onClick={handleClearAll}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
              >
                <span>Clear All Filters</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Slide-over Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white p-6 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900">Filter Listings</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar isMobile={true} onClose={() => setIsMobileFilterOpen(false)} />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

