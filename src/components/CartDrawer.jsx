import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    showToast 
  } = useMarketplace();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const estimatedTax = Math.round(subtotal * 0.05);
  const total = subtotal + estimatedTax;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
      showToast('Order inquiry sent to sellers!', 'success');
    }, 1500);
  };

  const handleClose = () => {
    setCheckoutComplete(false);
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-base text-slate-900">
                Cart & Inquiries
              </h2>
              {cart.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout Success Screen */}
          {checkoutComplete ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Order Inquiry Sent!</h3>
              <p className="text-sm text-slate-600 mt-2 max-w-xs leading-relaxed">
                The respective sellers have received your purchase reservation request. They will confirm pickup/delivery shortly!
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm"
              >
                Back to Marketplace
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length > 0 ? (
                  cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-200 shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">
                              {product.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Seller: {product.seller.name}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50">
                          <span className="font-bold text-sm text-slate-900">
                            ${(product.price * quantity).toLocaleString()}
                          </span>

                          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                            <button
                              onClick={() => updateCartQuantity(product.id, -1)}
                              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1 text-slate-700">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(product.id, 1)}
                              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">Your Cart is Empty</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Discover amazing secondhand deals or new products and add them here to start an inquiry.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-5 px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Browse Items
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {cart.length > 0 && (
                <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-800">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Service / Protection</span>
                      <span className="font-semibold text-slate-800">${estimatedTax}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                      <span>Estimated Total</span>
                      <span className="text-indigo-600">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Free buyer protection & local escrow guarantee</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                  >
                    <span>{isCheckingOut ? 'Processing...' : 'Proceed to Checkout / Inquiry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

