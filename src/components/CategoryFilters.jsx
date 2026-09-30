import React from 'react';
import { 
  LayoutGrid, 
  Laptop, 
  Armchair, 
  Shirt, 
  Bike, 
  Coffee, 
  Gamepad2 
} from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';
import { useMarketplace } from '../context/MarketplaceContext';

const ICON_MAP = {
  LayoutGrid,
  Laptop,
  Armchair,
  Shirt,
  Bike,
  Coffee,
  Gamepad2
};

export default function CategoryFilters() {
  const { selectedCategory, setSelectedCategory, products } = useMarketplace();

  // Helper to get count per category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  return (
    <div className="border-b border-slate-200/70 bg-white sticky top-16 sm:top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || LayoutGrid;
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
                <span
                  className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-slate-800 text-slate-200 font-semibold'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

