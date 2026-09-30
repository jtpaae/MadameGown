import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const MarketplaceContext = createContext();

const STORAGE_KEYS = {
  PRODUCTS: 'easymarket_products_v1',
  FAVORITES: 'easymarket_favorites_v1',
  CART: 'easymarket_cart_v1'
};

export function MarketplaceProvider({ children }) {
  // 1. Products state with localStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      console.error('Error loading products from localStorage:', e);
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 3. Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Filtering & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc' | 'popular'

  // Modals & Drawers
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'info' }

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Actions
  const addProduct = (newProductData) => {
    const newProduct = {
      ...newProductData,
      id: `prod-${Date.now()}`,
      views: 1,
      featured: false,
      createdAt: new Date().toISOString(),
      seller: {
        name: "You (Demo User)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        rating: 5.0,
        reviewCount: 1,
        verified: true,
        memberSince: "Just now",
        responseTime: "Instant replies"
      }
    };

    setProducts(prev => [newProduct, ...prev]);
    showToast(`"${newProduct.title}" has been published to the marketplace!`, 'success');
    return newProduct;
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your favorites!', 'success');
        return [...prev, productId];
      }
    });
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        showToast(`Increased quantity for "${product.title}"`, 'success');
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        showToast(`Added "${product.title}" to cart!`, 'success');
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared', 'info');
  };

  // Filtered & Sorted items computation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesCategory = product.category?.toLowerCase().includes(q);
        const matchesLocation = product.location?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesLocation) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Condition Filter
      if (selectedCondition !== 'All Conditions' && product.condition !== selectedCondition) {
        return false;
      }

      // 4. Price Filter
      const minPrice = priceRange.min !== '' ? Number(priceRange.min) : null;
      const maxPrice = priceRange.max !== '' ? Number(priceRange.max) : null;

      if (minPrice !== null && !isNaN(minPrice) && product.price < minPrice) {
        return false;
      }
      if (maxPrice !== null && !isNaN(maxPrice) && product.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      // 'newest' default
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, priceRange, sortBy]);

  const value = {
    products,
    filteredProducts,
    favorites,
    cart,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCondition,
    setSelectedCondition,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    activeProduct,
    setActiveProduct,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isCartOpen,
    setIsCartOpen,
    toast,
    showToast,
    addProduct,
    toggleFavorite,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}

