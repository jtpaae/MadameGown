import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Footer() {
  const { setSelectedCategory, setIsCreateModalOpen } = useMarketplace();

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Easy<span className="text-indigo-600">Market</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              The simplest marketplace platform for buying and selling anything locally. Built with speed, safety, and simplicity in mind.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified local community</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Popular Categories</h4>
            <ul className="space-y-2">
              {['Electronics', 'Furniture', 'Clothing & Fashion', 'Vehicles & Bikes', 'Home & Kitchen'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Buying & Selling Tips */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">Community & Safety</h4>
            <ul className="space-y-2 text-slate-500">
              <li>• Always meet in busy public places</li>
              <li>• Inspect high-value electronics thoroughly</li>
              <li>• Use in-app chat for buyer inquiries</li>
              <li>• Zero listing fees for local sellers</li>
            </ul>
          </div>

          {/* Sell Callout */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Have items to sell?</span>
              </div>
              <p className="text-indigo-900/80 leading-relaxed">
                Take 2 photos, set a fair price, and start chatting with nearby buyers today.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>List an Item Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} EasyMarket Prototype. Built with React & Tailwind CSS.</p>
          <div className="flex items-center gap-1">
            <span>Data stored locally in your browser (LocalStorage)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

