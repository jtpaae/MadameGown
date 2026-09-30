import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Heart, 
  ShoppingBag, 
  MessageSquare, 
  Clock, 
  Share2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function ProductDetailModal() {
  const { 
    activeProduct, 
    setActiveProduct, 
    favorites, 
    toggleFavorite, 
    addToCart, 
    showToast 
  } = useMarketplace();

  const [messageText, setMessageText] = useState("Hi, is this item still available? I'm interested!");
  const [isMessageSent, setIsMessageSent] = useState(false);

  if (!activeProduct) return null;

  const isFavorited = favorites.includes(activeProduct.id);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setIsMessageSent(true);
    showToast(`Inquiry sent to ${activeProduct.seller.name}!`, 'success');
    setTimeout(() => {
      setIsMessageSent(false);
    }, 4000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Marketplace link copied to clipboard!', 'info');
    } else {
      showToast('Sharing link generated', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setActiveProduct(null)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close button */}
          <button
            onClick={() => setActiveProduct(null)}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-md transition-all hover:scale-105"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Big Product Image */}
            <div className="relative bg-slate-100 flex items-center justify-center min-h-[300px] md:min-h-full">
              <img
                src={activeProduct.image}
                alt={activeProduct.title}
                className="w-full h-full object-cover max-h-[500px]"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                  {activeProduct.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-md">
                  {activeProduct.condition}
                </span>
              </div>
            </div>

            {/* Right Column: Information & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                
                {/* Price & Actions Row */}
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <span className="text-3xl font-black text-slate-950 tracking-tight">
                    ${activeProduct.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleShare}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                      title="Share listing"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(activeProduct.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorited
                          ? 'text-rose-500 bg-rose-50'
                          : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100'
                      }`}
                      title="Bookmark"
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {activeProduct.title}
                </h1>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 mb-5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{activeProduct.location}</span>
                </div>

                {/* Description */}
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {activeProduct.description}
                  </p>
                </div>

                {/* Seller Info Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeProduct.seller.avatar}
                        alt={activeProduct.seller.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900">
                            {activeProduct.seller.name}
                          </h4>
                          {activeProduct.seller.verified && (
                            <ShieldCheck className="w-4 h-4 text-indigo-600" title="Verified Seller" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{activeProduct.seller.rating}</span>
                          <span className="text-slate-400">({activeProduct.seller.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      Member: {activeProduct.seller.memberSince}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200/50">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeProduct.seller.responseTime}</span>
                  </div>
                </div>

                {/* Direct Message Seller Form */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    Send Seller a Message
                  </h3>
                  {isMessageSent ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Message sent! {activeProduct.seller.name} will be notified immediately.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="space-y-2">
                      <textarea
                        rows={2}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 resize-none"
                        placeholder="Ask the seller about pickup, condition, or best price..."
                      />
                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </button>
                    </form>
                  )}
                </div>

              </div>

              {/* Action Bar (Add to Cart / Buy) */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => {
                    addToCart(activeProduct);
                    setActiveProduct(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-transform active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart / Buy Now</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

