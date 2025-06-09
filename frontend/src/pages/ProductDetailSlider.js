import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import axios from 'axios';
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  Gem, 
  Shield, 
  Truck, 
  RotateCcw, 
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  Award,
  Diamond,
  Info,
  Minus,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductImageGallery from '../components/ProductImageGallery';
import { useFavorites } from '../hooks/useFavorites';
import PageSEO from '../components/SEO/PageSEO';

const ProductDetailSlider = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [availableCarats, setAvailableCarats] = useState([]);
  const [selectedCaratIndex, setSelectedCaratIndex] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  useEffect(() => {
    if (product && availableCarats.length > 0) {
      const defaultIndex = availableCarats.findIndex(carat => carat.is_default);
      const initialIndex = defaultIndex >= 0 ? defaultIndex : 0;
      setSelectedCaratIndex(initialIndex);
      calculatePrice(initialIndex);
    } else if (product) {
      setCurrentPrice(product.price || 0);
    }
  }, [product, availableCarats]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data);
      
      try {
        const caratsResponse = await axios.get(`/products/${id}/carats`);
        setAvailableCarats(caratsResponse.data);
      } catch (error) {
        setAvailableCarats([]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('שגיאה בטעינת המוצר');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get('/products');
      const filtered = response.data
        .filter(p => p.id !== parseInt(id))
        .slice(0, 3);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const calculatePrice = useCallback(async (caratIndex) => {
    if (!product || availableCarats.length === 0) return;
    
    const selectedCarat = availableCarats[caratIndex];
    if (!selectedCarat) return;

    setPriceLoading(true);
    
    try {
      const response = await axios.get(`/products/${id}/price`, {
        params: { carat_pricing_id: selectedCarat.carat_pricing_id }
      });
      setCurrentPrice(response.data.final_price);
    } catch (error) {
      console.error('Error calculating price:', error);
      const basePrice = product.base_price || product.price || 0;
      const discountMultiplier = product.discount_percentage ? (1 - product.discount_percentage / 100) : 1;
      const caratMultiplier = selectedCarat.carat_weight || 1;
      const fallbackPrice = Math.round(basePrice * caratMultiplier * discountMultiplier);
      setCurrentPrice(fallbackPrice);
    } finally {
      setPriceLoading(false);
    }
  }, [product, availableCarats, id]);

  const handleCaratChange = useCallback((newIndex) => {
    if (newIndex !== selectedCaratIndex && newIndex >= 0 && newIndex < availableCarats.length) {
      setSelectedCaratIndex(newIndex);
      calculatePrice(newIndex);
    }
  }, [selectedCaratIndex, availableCarats.length, calculatePrice]);

  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value);
    handleCaratChange(newIndex);
  };

  const decrementCarat = () => {
    if (selectedCaratIndex > 0) {
      handleCaratChange(selectedCaratIndex - 1);
    }
  };

  const incrementCarat = () => {
    if (selectedCaratIndex < availableCarats.length - 1) {
      handleCaratChange(selectedCaratIndex + 1);
    }
  };

  const handleAddToCart = () => {
    if (availableCarats.length > 0 && selectedCaratIndex < 0) {
      toast.error('אנא בחר גודל קראט');
      return;
    }

    const selectedCarat = availableCarats[selectedCaratIndex];
    const cartItem = {
      id: `${product.id}_${selectedCarat?.carat_pricing_id || 'default'}`,
      productId: product.id,
      name: product.name,
      price: currentPrice,
      image: Array.isArray(product.images) ? product.images[0] : product.image_url,
      caratWeight: selectedCarat?.carat_weight || null,
      caratPricingId: selectedCarat?.carat_pricing_id || null
    };

    addItem(cartItem);
    toast.success('המוצר נוסף לעגלה בהצלחה!');
  };

  const toggleFavorite = () => {
    const isFavorite = favorites.some(fav => fav.id === product.id);
    if (isFavorite) {
      removeFromFavorites(product.id);
      toast.success('המוצר הוסר מהמועדפים');
    } else {
      addToFavorites(product);
      toast.success('המוצר נוסף למועדפים');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center px-4" dir="rtl">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-8 h-8 text-amber-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-slate-600 font-light text-lg">טוען את יצירת האמנות...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center px-4" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-light text-slate-800 mb-6">היצירה לא נמצאה</h2>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            חזרה לאוסף
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.id === product.id);
  const selectedCarat = availableCarats[selectedCaratIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100" dir="rtl">
      <PageSEO 
        page="product"
        title={product.name}
        description={product.description}
        product={product}
      />

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm font-light">
            <Link to="/" className="text-slate-500 hover:text-slate-800 transition-colors">דף הבית</Link>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
            <Link to="/products" className="text-slate-500 hover:text-slate-800 transition-colors">אוסף</Link>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
            <span className="text-slate-800 truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Product Images */}
          <div className="relative order-1 lg:order-1">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden p-4 md:p-8">
              <ProductImageGallery 
                images={product.images || product.image_url} 
                productName={product.name}
                className="w-full aspect-square rounded-xl md:rounded-2xl"
              />
            </div>
            
            {/* Quality Badges */}
            <div className="absolute top-4 md:top-6 right-4 md:right-6 space-y-2 md:space-y-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg">
                <Diamond className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-2">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-light text-slate-900 leading-tight mb-3">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-current" />
                      ))}
                      <span className="mr-2 text-xs md:text-sm text-slate-600 font-light">(127 ביקורות)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-amber-200">
              {priceLoading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse text-xl md:text-2xl font-light text-amber-600">מחשב מחיר...</div>
                </div>
              ) : (
                <div className="text-center">
                  {product.discount_percentage && (
                    <div className="text-xs md:text-sm text-slate-500 line-through mb-1 font-light">
                      ₪{Math.round((currentPrice || 0) / (1 - product.discount_percentage / 100)).toLocaleString()}
                    </div>
                  )}
                  <div className="text-2xl md:text-4xl font-light text-slate-900 mb-2">
                    ₪{(currentPrice || 0).toLocaleString()}
                  </div>
                  {product.discount_percentage && (
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      חסכון של {product.discount_percentage}%
                    </div>
                  )}
                  <p className="text-xs md:text-sm text-slate-600 mt-2 font-light">כולל מע״ם ומשלוח חינם</p>
                </div>
              )}
            </div>

            {/* Carat Selection with Custom Slider */}
            {availableCarats.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3">
                  <Gem className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base md:text-lg font-medium text-slate-900">בחירת קראט</h3>
                </div>

                <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-slate-200">
                  {/* Current Selection Display */}
                  <div className="text-center mb-6">
                    <div className="text-3xl md:text-4xl font-light text-slate-900 mb-2">
                      {selectedCarat?.carat_weight || 0} קראט
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                      <Info className="w-4 h-4" />
                      <span>גודל נבחר</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={decrementCarat}
                      disabled={selectedCaratIndex === 0}
                      className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Minus className="w-4 h-4 text-slate-700" />
                    </button>
                    
                    <div className="text-center flex-1 mx-4">
                      <div className="text-lg font-medium text-slate-800">
                        {selectedCaratIndex + 1} מתוך {availableCarats.length}
                      </div>
                    </div>
                    
                    <button
                      onClick={incrementCarat}
                      disabled={selectedCaratIndex === availableCarats.length - 1}
                      className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>

                  {/* Custom Slider */}
                  <div className="px-2 md:px-4">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max={availableCarats.length - 1}
                        value={selectedCaratIndex}
                        onChange={handleSliderChange}
                        className="carat-slider w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                      />
                      <div className="flex justify-between mt-4 px-2">
                        <span className="text-xs md:text-sm text-slate-500">
                          {availableCarats[0]?.carat_weight || ''} קראט
                        </span>
                        <span className="text-xs md:text-sm text-slate-500">
                          {availableCarats[availableCarats.length - 1]?.carat_weight || ''} קראט
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Carat Options Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-6">
                    {availableCarats.map((carat, index) => (
                      <button
                        key={carat.id}
                        onClick={() => handleCaratChange(index)}
                        className={`p-2 rounded-lg text-xs transition-all duration-200 ${
                          index === selectedCaratIndex
                            ? 'bg-amber-100 text-amber-800 border-2 border-amber-400'
                            : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                        }`}
                      >
                        {carat.carat_weight}
                      </button>
                    ))}
                  </div>

                  {/* Selected Carat Info */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center">
                    <span className="text-slate-700 font-light">
                      נבחר: {selectedCarat?.carat_weight || 0} קראט
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={availableCarats.length > 0 && selectedCaratIndex < 0}
                className="w-full bg-slate-900 text-white py-3 md:py-4 px-6 md:px-8 rounded-full font-medium hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg text-sm md:text-base"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                {availableCarats.length > 0 && selectedCaratIndex < 0 ? 'בחר קראט כדי להוסיף לעגלה' : 'הוסף לעגלה'}
              </button>
              
              <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                <div className="flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 bg-white rounded-xl shadow-sm">
                  <Truck className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                  <span className="text-xs md:text-sm font-light text-slate-700">משלוח חינם</span>
                </div>
                <div className="flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  <span className="text-xs md:text-sm font-light text-slate-700">אחריות מלאה</span>
                </div>
                <div className="flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 bg-white rounded-xl shadow-sm">
                  <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  <span className="text-xs md:text-sm font-light text-slate-700">החזרה חינם</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
              <h3 className="text-base md:text-lg font-medium text-slate-900 mb-4">אודות היצירה</h3>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed font-light">
                {product.description || 'יצירת אמנות יהלומים מעוצבת ברמה הגבוהה ביותר. כל יהלום נבחר בקפידה ומעובד בטכנולוגיה מתקדמת. מושלם לאירועים מיוחדים או כהשקעה יוקרתית לעתיד.'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-light text-slate-900 mb-4">יצירות דומות</h2>
              <p className="text-slate-600 font-light">המלצות מותאמות אישית מהאוסף שלנו</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/products/${relatedProduct.id}`}
                  className="group bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-slate-50">
                    <img
                      src={Array.isArray(relatedProduct.images) ? relatedProduct.images[0] : relatedProduct.image_url || "/api/placeholder/400/400"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="font-medium text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2 text-sm md:text-base">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-lg md:text-xl font-light text-slate-800">
                      החל מ ₪{(relatedProduct.price || 0).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .carat-slider {
          background: linear-gradient(to right, #f1f5f9 0%, #e2e8f0 100%);
        }
        
        .carat-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          transition: all 0.2s ease;
        }
        
        .carat-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        
        .carat-slider::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        
        .carat-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          transition: all 0.2s ease;
        }
        
        .carat-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        @media (min-width: 768px) {
          .carat-slider::-webkit-slider-thumb {
            width: 28px;
            height: 28px;
          }
          
          .carat-slider::-moz-range-thumb {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailSlider; 