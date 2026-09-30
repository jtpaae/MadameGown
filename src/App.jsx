import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilters from './components/CategoryFilters';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CreateListingModal from './components/CreateListingModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { CheckCircle, Info } from 'lucide-react';

function ToastContainer() {
  const { toast } = useMarketplace();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
        toast.type === 'info'
          ? 'bg-slate-900/90 text-white border-slate-700'
          : 'bg-emerald-950/90 text-emerald-100 border-emerald-800'
      }`}>
        {toast.type === 'info' ? (
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
        ) : (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function MarketplaceApp() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Header & Value Props */}
      <HeroBanner />

      {/* Category Pills Bar */}
      <CategoryFilters />

      {/* Main Content Feed with Filters and Grid */}
      <main className="flex-1">
        <ProductGrid />
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CreateListingModal />
      <CartDrawer />
      <ToastContainer />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceApp />
    </MarketplaceProvider>
  );
}

