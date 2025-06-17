import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import axios from 'axios';
import { getProduct, getProductPrice } from '../utils/api';
import { 
  Heart, 
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
  Info
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
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Selection states
  const [selectedCaratIndex, setSelectedCaratIndex] = useState(0);
  const [selectedMetal, setSelectedMetal] = useState('14k'); // Metal selection (14k, 18k)
  const [selectedColor, setSelectedColor] = useState('זהב לבן'); // Default color
  const [selectedSize, setSelectedSize] = useState('6'); // Default ring size
  
  // Price states with smooth transitions
  const [currentPrice, setCurrentPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);
  
  // Available options
  const metalOptions = [
    { name: '18k', value: '18k', multiplier: 1.3 },
    { name: '14k', value: '14k', multiplier: 1.0 }
  ];
  
  const ringColors = [
    { name: 'זהב לבן', value: 'white', color: '#E8E8E8' },
    { name: 'זהב צהוב', value: 'yellow', color: '#FFD700' },
    { name: 'זהב ורוד', value: 'rose', color: '#E8B4A0' }
  ];
  
  const ringSizes = [
    '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'
  ];

  // Deduplicate carats and memoize the result
  const uniqueCarats = useMemo(() => {
    if (!availableCarats || availableCarats.length === 0) return [];
    

    
    // Use Map to deduplicate by carat_weight, keeping the first occurrence
    const caratMap = new Map();
    
    availableCarats.forEach(current => {
      const weight = parseFloat(current.carat_weight);
      if (!caratMap.has(weight)) {
        caratMap.set(weight, {
          ...current,
          carat_pricing_id: current.id // Map id to carat_pricing_id for compatibility
        });
      }
    });
    
    const unique = Array.from(caratMap.values());
    const sorted = unique.sort((a, b) => parseFloat(a.carat_weight) - parseFloat(b.carat_weight));
    

    return sorted;
  }, [availableCarats]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
  
      setLoading(true);
      try {
        // Use API utility function
        const response = await getProduct(id);
        console.log('✅ Product data received:', response.data);
        
        const productData = response.data;
        
        console.log('✅ Product data loaded:', productData);
        console.log('Available carats raw:', productData.available_carats);
        console.log('Available carats length:', productData.available_carats?.length);
        
        setProduct(productData);
        setBasePrice(productData.price || productData.base_price || 0);
        
        if (productData.available_carats && Array.isArray(productData.available_carats)) {
          console.log('✅ Setting available carats:', productData.available_carats.length);
          setAvailableCarats(productData.available_carats);
        } else {
          console.log('❌ No available_carats found or not an array:', productData.available_carats);
        }
        
        // Fetch related products from the same category
        if (productData.category_id) {
          try {
            const relatedResponse = await axios.get(`/api/products?category_id=${productData.category_id}&limit=8&exclude=${id}`);
            setRelatedProducts(relatedResponse.data.filter(p => p.id !== parseInt(id)) || []);
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
          }
        }
        
      } catch (error) {
        console.error('❌ All API attempts failed:', error);
        setError(`שגיאה בטעינת המוצר: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Initialize price when carats are loaded
  useEffect(() => {
    if (uniqueCarats.length > 0 && currentPrice === 0) {
      // Price will be calculated by the main price calculation useEffect
      console.log('Carats loaded, price calculation will trigger automatically');
    }
  }, [uniqueCarats, currentPrice]);

  const handleCaratChange = useCallback((newIndex) => {
    if (newIndex !== selectedCaratIndex && newIndex >= 0 && newIndex < uniqueCarats.length) {
      setSelectedCaratIndex(newIndex);
    }
  }, [selectedCaratIndex, uniqueCarats.length]);

  const handleAddToCart = () => {
    if (!product || uniqueCarats.length === 0) return;
    
    const selectedCarat = uniqueCarats[selectedCaratIndex];
    const cartItem = {
      id: `${product.id}-${selectedCarat.carat_pricing_id}-${selectedMetal}-${selectedColor}-${selectedSize}`,
      name: product.name,
      price: currentPrice,
      image: product.image_url,
      carat: selectedCarat.carat_weight,
      metal: selectedMetal,
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

  // Calculate price with debouncing  
  useEffect(() => {
    const calculatePrice = async () => {
      if (!product || selectedCaratIndex === null || !uniqueCarats[selectedCaratIndex]) return;
      
      const selectedCarat = uniqueCarats[selectedCaratIndex];
      console.log('Calculating price for carat:', selectedCarat.carat_weight);
      
      setPriceLoading(true);
      try {
        // Use API utility function
        const response = await getProductPrice(id, selectedCarat.carat_weight);
        
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
        console.error('❌ Price calculation failed:', error);
        // Enhanced fallback calculation with metal multiplier
        const baseProductPrice = product.price || product.base_price || basePrice || 1000;
        const caratMultiplier = Math.pow(parseFloat(selectedCarat.carat_weight), 1.5);
        const metalMultiplier = metalOptions.find(m => m.value === selectedMetal)?.multiplier || 1.0;
        const fallbackPrice = Math.round(baseProductPrice * caratMultiplier * metalMultiplier);
        
        console.log('Fallback price calculation:', {
          base: baseProductPrice,
          caratWeight: selectedCarat.carat_weight,
          caratMultiplier,
          metalMultiplier,
          final: fallbackPrice
        });
        
        setCurrentPrice(fallbackPrice);
      } finally {
        setPriceLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      calculatePrice();
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [selectedCaratIndex, uniqueCarats, selectedMetal, selectedColor, selectedSize, id, basePrice, product]);

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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <PageSEO 
        title={`${product.name} - DiamondLab Store`}
        description={product.description}
        image={product.image_url}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation - Simple */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-gray-900">עמוד הבית</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-900">קולקציות</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-900">קולקציות</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">LUMINA / ILUMA DUO</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ProductImageGallery 
              images={product.images || [{ url: product.image_url, alt: product.name }]} 
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ILUMA DUO
              </h1>
              <p className="text-lg text-gray-600">
                בחר/י את צבע התכשיטים
              </p>
            </div>

            {/* Metal Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedMetal('14k')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedMetal === '14k'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  14K
                </button>
                <button
                  onClick={() => setSelectedMetal('14k')}
                  className="px-6 py-3 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  14K
                </button>
                <button
                  onClick={() => setSelectedMetal('14k')}
                  className="px-6 py-3 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  14K
                </button>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="space-y-4">
              {/* Carat */}
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">קראט:</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {selectedCarat ? `CT ${parseFloat(selectedCarat.carat_weight).toFixed(2)}` : 'CT 1.00'}
                </span>
              </div>

              {/* Clarity */}
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">ניקיון:</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {product.clarity_grade || 'VS1'}
                </span>
              </div>

              {/* Color */}
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">צבע:</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {product.color_grade || 'D-E'}
                </span>
              </div>
            </div>

            {/* Carat Selection - Keep functionality */}
            {uniqueCarats.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                  בחירת קראט ({uniqueCarats.length} אפשרויות)
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {uniqueCarats.map((carat, index) => (
                    <button
                      key={index}
                      onClick={() => handleCaratChange(index)}
                      className={`px-4 py-3 rounded-lg border-2 text-center transition-all ${
                        index === selectedCaratIndex
                          ? 'border-teal-500 bg-teal-50 text-teal-900'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">
                        {parseFloat(carat.carat_weight).toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Display */}
            <div className="text-center py-6">
              <div className="text-sm text-gray-600 mb-2">נבקש</div>
              <div className="text-4xl font-bold text-gray-900">
                <AnimatedPrice value={currentPrice || 7950} />
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={uniqueCarats.length === 0 || priceLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-lg font-medium text-lg transition-colors disabled:opacity-50"
            >
              הוספה לסל
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-gray-900">עוד מהקטגוריה</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 8).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <ProductImageGallery 
                      images={relatedProduct.images || relatedProduct.image_url} 
                      productName={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      showNavigation={false}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-lg font-semibold text-gray-900">
                      ₪{(relatedProduct.price || 0).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailSlider; 