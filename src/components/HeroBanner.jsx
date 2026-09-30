import React from 'react';
import { Sparkles, ShieldCheck, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function HeroBanner() {
  const { setIsCreateModalOpen } = useMarketplace();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/60 py-10 sm:py-14">
      {/* Decorative gradient blur background spots */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-xs font-semibold text-indigo-700 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>The Easiest Way to Buy & Sell Today</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Find great deals nearby,{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            sell in 60 seconds.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Zero listing fees, verified neighbors, and direct messaging. Clear out what you don't need or discover secondhand treasures at great prices.
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all active:scale-95"
          >
            <span>Post a Free Listing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#listings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
          >
            Explore Marketplace
          </a>
        </div>

        {/* Value Proposition Badges */}
        <div className="mt-10 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
            <div className="p-2 rounded-lg bg-indigo-100/70 text-indigo-700">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">List in 60 Seconds</h4>
              <p className="text-[11px] text-slate-500">Quick photos & easy form</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
            <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">0% Commission</h4>
              <p className="text-[11px] text-slate-500">Keep 100% of your sale</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
            <div className="p-2 rounded-lg bg-violet-100/70 text-violet-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Direct Chat</h4>
              <p className="text-[11px] text-slate-500">Fast buyer & seller chat</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
            <div className="p-2 rounded-lg bg-amber-100/70 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Local & Trusted</h4>
              <p className="text-[11px] text-slate-500">Verified community members</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

