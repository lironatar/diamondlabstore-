import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Plus,
  Palette,
  Ruler
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductImageGallery from '../components/ProductImageGallery';
import { useFavorites } from '../hooks/useFavorites';
import PageSEO from '../components/SEO/PageSEO';

// Smooth number animation component (inspired by NumberFlow)
const AnimatedPrice = ({ value, currency = '₪' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);
  
  return (
    <span 
      className={`transition-all duration-300 ${isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {currency}{(displayValue || 0).toLocaleString()}
    </span>
  );
};

const ProductDetailSlider = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Product data states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCarats, setAvailableCarats] = useState([]);
  
  // Selection states
  const [selectedCaratIndex, setSelectedCaratIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('ירוק'); // Default color
  const [selectedSize, setSelectedSize] = useState('6'); // Default ring size
  
  // Price states with smooth transitions
  const [currentPrice, setCurrentPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);
  
  // Available options
  const ringColors = [
    { name: 'ירוק', value: 'green', color: '#10b981' },
    { name: 'זהב צהוב', value: 'yellow', color: '#fbbf24' },
    { name: 'זהב לבן', value: 'white', color: '#e5e7eb' },
    { name: 'זהב ורוד', value: 'rose', color: '#f472b6' },
    { name: 'פלטינום', value: 'platinum', color: '#9ca3af' }
  ];
  
  const ringSizes = [
    '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'
  ];

  // Deduplicate carats and memoize the result
  const uniqueCarats = useMemo(() => {
    if (!availableCarats || availableCarats.length === 0) return [];
    
    const unique = availableCarats.reduce((acc, current) => {
      const existingIndex = acc.findIndex(item => 
        parseFloat(item.carat_weight) === parseFloat(current.carat_weight)
      );
      
      if (existingIndex === -1) {
        acc.push(current);
      }
      
      return acc;
    }, []);
    
    return unique.sort((a, b) => parseFloat(a.carat_weight) - parseFloat(b.carat_weight));
  }, [availableCarats]);

  // Calculate price with debounce to prevent flickering
  const calculatePrice = useCallback(async (caratIndex) => {
    if (!product || !uniqueCarats[caratIndex]) {
      console.log('No product or carat available for price calculation');
      return;
    }
    
    setPriceLoading(true);
    const selectedCarat = uniqueCarats[caratIndex];
    
    console.log('Calculating price for:', {
      product: product.id,
      carat: selectedCarat.carat_weight,
      color: selectedColor,
      size: selectedSize
    });
    
    try {
      // Simulate API delay to show smooth transition
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const response = await axios.get(`/products/${id}/price`, {
        params: { 
          carat_pricing_id: selectedCarat.carat_pricing_id,
          color: selectedColor,
          size: selectedSize
        },
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 500,
      });
      
      console.log('✅ Full API Response:', response);
      
      // Enhanced response parsing with multiple field checks
      let extractedPrice = null;
      
      if (response.data) {
        const priceFields = ['final_price', 'price', 'total_price', 'calculated_price', 'amount', 'cost'];
        
        for (const field of priceFields) {
          if (response.data[field] !== undefined && response.data[field] !== null) {
            let fieldValue = response.data[field];
            
            if (typeof fieldValue === 'object' && fieldValue.value !== undefined) {
              fieldValue = fieldValue.value;
            }
            
            const numericValue = typeof fieldValue === 'string' ? 
              parseFloat(fieldValue.replace(/[^\d.-]/g, '')) : Number(fieldValue);
            
            if (!isNaN(numericValue) && numericValue >= 0) {
              extractedPrice = numericValue;
              console.log(`✅ Found valid price in field '${field}':`, extractedPrice);
              break;
            }
          }
        }
      }
      
      if (extractedPrice !== null) {
        setCurrentPrice(extractedPrice);
      } else {
        throw new Error('Invalid price response format');
      }
      
    } catch (error) {
      console.log('Price API failed, calculating fallback price:', error.message);
      
      // Enhanced fallback calculation
      const baseProductPrice = product.price || product.base_price || basePrice || 1000;
      const caratMultiplier = Math.pow(parseFloat(selectedCarat.carat_weight), 1.5);
      const colorMultiplier = selectedColor === 'platinum' ? 1.2 : 1.0;
      const fallbackPrice = Math.round(baseProductPrice * caratMultiplier * colorMultiplier);
      
      console.log('Fallback price calculation:', {
        base: baseProductPrice,
        caratWeight: selectedCarat.carat_weight,
        caratMultiplier,
        colorMultiplier,
        final: fallbackPrice
      });
      
      setCurrentPrice(fallbackPrice);
    } finally {
      setPriceLoading(false);
    }
  }, [product, uniqueCarats, selectedColor, selectedSize, id, basePrice]);

  // Debounced price calculation
  useEffect(() => {
    if (uniqueCarats.length > 0) {
      const timeoutId = setTimeout(() => {
        calculatePrice(selectedCaratIndex);
      }, 300); // 300ms debounce to prevent flickering
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCaratIndex, selectedColor, selectedSize, calculatePrice]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/products/${id}`);
        const productData = response.data;
        
        console.log('Product data:', productData);
        
        setProduct(productData);
        setBasePrice(productData.price || productData.base_price || 0);
        
        if (productData.carat_pricing && Array.isArray(productData.carat_pricing)) {
          setAvailableCarats(productData.carat_pricing);
        }
        
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('שגיאה בטעינת המוצר');
        toast.error('שגיאה בטעינת המוצר');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Initialize price when carats are loaded
  useEffect(() => {
    if (uniqueCarats.length > 0 && currentPrice === 0) {
      calculatePrice(0);
    }
  }, [uniqueCarats, currentPrice, calculatePrice]);

  const handleCaratChange = useCallback((newIndex) => {
    if (newIndex !== selectedCaratIndex && newIndex >= 0 && newIndex < uniqueCarats.length) {
      setSelectedCaratIndex(newIndex);
    }
  }, [selectedCaratIndex, uniqueCarats.length]);

  const handleAddToCart = () => {
    if (!product || uniqueCarats.length === 0) return;
    
    const selectedCarat = uniqueCarats[selectedCaratIndex];
    const cartItem = {
      id: `${product.id}-${selectedCarat.carat_pricing_id}-${selectedColor}-${selectedSize}`,
      name: product.name,
      price: currentPrice,
      image: product.image_url,
      carat: selectedCarat.carat_weight,
      color: selectedColor,
      size: selectedSize,
      product_id: product.id,
      carat_pricing_id: selectedCarat.carat_pricing_id
    };
    
    addItem(cartItem);
    toast.success('המוצר נוסף לעגלה!');
  };

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast.success('המוצר הוסר מהמועדפים');
    } else {
      addToFavorites(product);
      toast.success('המוצר נוסף למועדפים!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full">
            <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
          </div>
          <p className="text-slate-600 font-light">טוען את יצירת האמנות...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <Link to="/products" className="text-amber-600 hover:text-amber-700 underline">
            חזרה למוצרים
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const selectedCarat = uniqueCarats[selectedCaratIndex];
  const originalPrice = currentPrice * 1.2; // 20% higher as original price

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50" dir="rtl">
      <PageSEO 
        title={`${product.name} - DiamondLab Store`}
        description={product.description}
        image={product.image_url}
      />
      
      <div className="container mx-auto px-4 py-6 lg:py-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm w-fit">
          <Link to="/" className="hover:text-amber-600 transition-colors">בית</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link to="/products" className="hover:text-amber-600 transition-colors">מוצרים</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
              <ProductImageGallery 
                images={product.images || [{ url: product.image_url, alt: product.name }]} 
              />
              
              {/* Quality Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <Diamond className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <button
                  onClick={handleToggleFavorite}
                  className="p-3 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} 
                  />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-slate-600 font-light">(127 ביקורות)</span>
              </div>
            </div>

            {/* Carat Selection */}
            {uniqueCarats.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Gem className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-medium text-slate-900">בחירת קראט</h3>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  {/* Carat Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={uniqueCarats.length - 1}
                      value={selectedCaratIndex}
                      onChange={(e) => handleCaratChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-400 rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(selectedCaratIndex / (uniqueCarats.length - 1)) * 100}%, #e5e7eb ${(selectedCaratIndex / (uniqueCarats.length - 1)) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    
                    {/* Carat markers */}
                    <div className="flex justify-between mt-3">
                      {uniqueCarats.map((carat, index) => (
                        <div
                          key={index}
                          className={`text-center cursor-pointer transition-all duration-300 ${
                            index === selectedCaratIndex 
                              ? 'text-amber-600 font-semibold scale-110' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                          onClick={() => handleCaratChange(index)}
                        >
                          <div className={`text-sm font-medium ${
                            index === selectedCaratIndex ? 'text-amber-600' : 'text-slate-600'
                          }`}>
                            {parseFloat(carat.carat_weight).toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-400">קראט</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ring Color Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-medium text-slate-900">צבע הטבעת</h3>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex flex-wrap gap-3">
                  {ringColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        selectedColor === color.name
                          ? 'border-amber-400 bg-amber-50 shadow-md scale-105'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: color.color }}
                      />
                      <span className={`text-sm font-medium ${
                        selectedColor === color.name ? 'text-amber-900' : 'text-slate-700'
                      }`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ring Size Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-medium text-slate-900">מידת הטבעת</h3>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {ringSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Display - Now positioned below selections */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-light text-slate-900 transition-all duration-500 ${
                      priceLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    }`}>
                      <AnimatedPrice value={currentPrice} />
                    </div>
                    {originalPrice > currentPrice && (
                      <div className="text-lg text-slate-500 line-through">
                        ₪{originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-slate-600 font-light">
                    כולל מע"ם ומשלוח חינם
                  </div>
                  
                  {selectedCarat && (
                    <div className="text-sm text-slate-500">
                      קראט: {parseFloat(selectedCarat.carat_weight).toFixed(2)} | 
                      צבע: {selectedColor} | 
                      מידה: {selectedSize}
                    </div>
                  )}
                </div>
                
                {priceLoading && (
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-200 rounded-full">
                    <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={uniqueCarats.length === 0 || priceLoading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-5 h-5" />
                הוסף לעגלה
              </button>
              
              <button className="sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-full font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5" />
                קנה עכשיו
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, title: 'אחריות לכל החיים', color: 'text-green-600', bg: 'bg-green-50' },
                { icon: Truck, title: 'משלוח חינם', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: RotateCcw, title: 'החזרה 30 יום', color: 'text-purple-600', bg: 'bg-purple-50' }
              ].map((feature, index) => (
                <div key={index} className={`${feature.bg} rounded-xl p-4 text-center transition-all duration-300 hover:shadow-md hover:scale-105`}>
                  <feature.icon className={`w-6 h-6 ${feature.color} mx-auto mb-2`} />
                  <div className="text-sm font-medium text-slate-700">{feature.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ProductDetailSlider; 