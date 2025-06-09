import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import ReactSlider from 'react-slider';
import axios from 'axios';
import { Heart, Star, Truck, Shield, RotateCcw, ShoppingCart, Gem, Calculator, DollarSign } from 'lucide-react';
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
      // Find default carat or use first available
      const defaultIndex = availableCarats.findIndex(carat => carat.is_default);
      const initialIndex = defaultIndex >= 0 ? defaultIndex : 0;
      setSelectedCaratIndex(initialIndex);
      calculatePrice(initialIndex);
    } else if (product) {
      // Fallback to original price if no carats
      setCurrentPrice(product.price || 0);
    }
  }, [product, availableCarats]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data);
      
      // Fetch available carats for this product
      try {
        const caratsResponse = await axios.get(`/products/${id}/carats`);
        setAvailableCarats(caratsResponse.data);
      } catch (error) {
        console.log('No carats available for this product');
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
      // Filter out current product and limit to 4
      const filtered = response.data
        .filter(p => p.id !== parseInt(id))
        .slice(0, 4);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const calculatePrice = async (caratIndex) => {
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
      // Fallback calculation
      const basePrice = product.base_price || product.price || 0;
      const discountMultiplier = product.discount_percentage ? (1 - product.discount_percentage / 100) : 1;
      const caratMultiplier = selectedCarat.carat_weight || 1;
      const fallbackPrice = Math.round(basePrice * caratMultiplier * discountMultiplier);
      setCurrentPrice(fallbackPrice);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleCaratChange = (newIndex) => {
    setSelectedCaratIndex(newIndex);
    calculatePrice(newIndex);
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
      <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">טוען פרטי מוצר...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">מוצר לא נמצא</h2>
          <Link to="/products" className="text-gold hover:underline">
            חזרה לקטלוג המוצרים
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.id === product.id);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* SEO */}
      <PageSEO 
        page="product"
        title={product.name}
        description={product.description}
        product={product}
      />

      {/* Enhanced Styles */}
      <style jsx="true">{`
        .text-gold { color: #d4af37; }
        .bg-gold { background-color: #d4af37; }
        .border-gold { border-color: #d4af37; }
        .hover\\:bg-gold:hover { background-color: #d4af37; }
        
        /* Slider Styles */
        .carat-slider {
          width: 100%;
          height: 8px;
          background: linear-gradient(to right, #f3f4f6, #d4af37);
          border-radius: 4px;
          position: relative;
          margin: 20px 0;
        }
        
        .carat-slider .slider-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          border: 3px solid white;
          border-radius: 50%;
          cursor: grab;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          top: -8px;
        }
        
        .carat-slider .slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
        }
        
        .carat-slider .slider-thumb:active {
          cursor: grabbing;
          transform: scale(0.95);
        }
        
        .carat-slider .slider-track {
          background: linear-gradient(to right, #e5e7eb, #d4af37);
          height: 8px;
          border-radius: 4px;
        }
        
        .carat-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 12px;
        }
        
        .carat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
          position: relative;
        }
        
        .carat-label.active {
          color: #d4af37;
          font-weight: 600;
        }
        
        .price-display {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 2px solid #d4af37;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .price-display::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #f4e4bc, #d4af37);
          animation: shimmer 2s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .loading-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm mb-8">
          <Link to="/" className="text-gray-500 hover:text-gray-700">דף הבית</Link>
          <span className="text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-gray-700">מוצרים</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <ProductImageGallery 
                images={product.images || product.image_url} 
                productName={product.name}
                className="w-full rounded-xl overflow-hidden"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                {/* Price Display */}
                <div className="price-display mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-gold" />
                    <span className="text-sm text-gray-600">מחיר נוכחי</span>
                  </div>
                  
                  {priceLoading ? (
                    <div className="text-3xl font-bold text-gold loading-pulse">
                      מחשב מחיר...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {product.discount_percentage && (
                        <div className="text-sm text-gray-500 line-through">
                          ₪{(currentPrice / (1 - product.discount_percentage / 100)).toLocaleString()}
                        </div>
                      )}
                      <div className="text-4xl font-bold text-gold">
                        ₪{currentPrice.toLocaleString()}
                      </div>
                      {product.discount_percentage && (
                        <div className="text-sm text-green-600 font-medium">
                          חסכון של {product.discount_percentage}%
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Carat Selection Slider */}
                {availableCarats.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Gem className="w-5 h-5 text-gold" />
                        בחר גודל קראט
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calculator className="w-4 h-4" />
                        <span>המחיר מתעדכן אוטומטית</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <ReactSlider
                        className="carat-slider"
                        thumbClassName="slider-thumb"
                        trackClassName="slider-track"
                        value={selectedCaratIndex}
                        onChange={handleCaratChange}
                        min={0}
                        max={availableCarats.length - 1}
                        step={1}
                        renderThumb={(props) => (
                          <div {...props}>
                            <Gem className="w-3 h-3 text-white" />
                          </div>
                        )}
                      />
                      
                      <div className="carat-labels">
                        {availableCarats.map((carat, index) => (
                          <div
                            key={carat.id}
                            className={`carat-label ${index === selectedCaratIndex ? 'active' : ''}`}
                          >
                            {carat.carat_weight} קראט
                          </div>
                        ))}
                      </div>
                      
                      {selectedCaratIndex >= 0 && availableCarats[selectedCaratIndex] && (
                        <div className="mt-4 text-center">
                          <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                            <Gem className="w-4 h-4 text-gold" />
                            <span className="font-medium text-gray-900">
                              נבחר: {availableCarats[selectedCaratIndex].carat_weight} קראט
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Product Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">4.9 (127 ביקורות)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={availableCarats.length > 0 && selectedCaratIndex < 0}
                  className="w-full bg-gold text-white py-4 px-6 rounded-xl font-medium hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {availableCarats.length > 0 && selectedCaratIndex < 0 ? 'בחר קראט כדי להוסיף לעגלה' : 'הוסף לעגלה'}
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-3 ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-gold" />
                  <div>
                    <div className="font-medium text-gray-900">משלוח חינם</div>
                    <div className="text-sm text-gray-600">למשלוחים מעל ₪500</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-gold" />
                  <div>
                    <div className="font-medium text-gray-900">אחריות מלאה</div>
                    <div className="text-sm text-gray-600">24 חודשים</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-6 h-6 text-gold" />
                  <div>
                    <div className="font-medium text-gray-900">החזרה חינם</div>
                    <div className="text-sm text-gray-600">תוך 30 יום</div>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">תיאור המוצר</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'תכשיט יהלום מעוצב ברמה הגבוהה ביותר, מיוצר בטכנולוגיה מתקדמת עם תשומת לב לכל פרט. מושלם לאירועים מיוחדים או כמתנה יוקרתית.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">מוצרים קשורים</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/products/${relatedProduct.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={Array.isArray(relatedProduct.images) ? relatedProduct.images[0] : relatedProduct.image_url || "/api/placeholder/300/300"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-gold font-bold text-sm">
                      אחל מ ₪{relatedProduct.price?.toLocaleString()}
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