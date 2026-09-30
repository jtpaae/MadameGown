import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  DollarSign, 
  MapPin, 
  Tag, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '../data/initialProducts';
import { useMarketplace } from '../context/MarketplaceContext';

const PRESET_SAMPLE_IMAGES = [
  { name: 'Headphones', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80' },
  { name: 'Desk Setup', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Leather Boots', url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80' },
  { name: 'Mechanical Watch', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80' },
];

export default function CreateListingModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, addProduct } = useMarketplace();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [location, setLocation] = useState('Downtown');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_IMAGES[0].url);
  const [imagePreview, setImagePreview] = useState(PRESET_SAMPLE_IMAGES[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  // Handle local file upload via FileReader
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url) => {
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    setIsSubmitting(true);

    const newListing = {
      title: title.trim(),
      category,
      price: Number(price),
      condition,
      location: location.trim() || 'Local Area',
      description: description.trim() || 'No description provided.',
      image: imageUrl || PRESET_SAMPLE_IMAGES[0].url
    };

    addProduct(newListing);

    setIsSubmitting(false);
    setIsCreateModalOpen(false);

    // Reset form
    setTitle('');
    setPrice('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCreateModalOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Post a New Listing</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Reach thousands of buyers in your neighborhood</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony WH-1000XM4 Wireless Headphones"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors"
              />
            </div>

            {/* Category & Condition Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                >
                  {CONDITIONS.filter(c => c !== 'All Conditions').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price ($ USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location / Neighborhood *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Greenpoint, Brooklyn"
                    className="w-full text-sm pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Image Selection / Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Photo
              </label>

              {/* Preview */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-xs">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    JPG, PNG, or WEBP. Max 5MB.
                  </p>
                </div>
              </div>

              {/* Sample presets */}
              <div className="text-[11px] text-slate-500 font-medium mb-1.5">Or choose a quick demo photo:</div>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_SAMPLE_IMAGES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 text-left h-14 ${
                      imagePreview === preset.url ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] px-1 py-0.5 text-center truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details on condition, included accessories, reason for selling, and pickup preferences..."
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing...' : 'Publish Listing for Free'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

