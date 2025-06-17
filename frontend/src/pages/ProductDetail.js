import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Diamond, Award, Shield, Heart, Star, ChevronDown, Phone, Mail, Sparkles, Check, Gem, ShoppingBag, MessageCircle, HelpCircle, ChevronUp } from 'lucide-react';
import { useCart } from 'react-use-cart';
import ProductImageGallery from '../components/ProductImageGallery';
import { useFavorites } from '../hooks/useFavorites';
import PageSEO from '../components/SEO/PageSEO';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState('14K');
  const [selectedCaratIndex, setSelectedCaratIndex] = useState(0);
  const [availableCarats, setAvailableCarats] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [caratExpanded, setCaratExpanded] = useState(true); // Keep expanded by default
  const [sizeExpanded, setSizeExpanded] = useState(false);
  
  // Cart functionality
  const { addItem } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    // Scroll to top when component mounts or ID changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (selectedCaratIndex >= 0 && product) {
      calculatePrice(selectedCaratIndex);
    }
  }, [selectedCaratIndex, product]);

  const fetchProduct = async () => {
    try {
              const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        
        // Fetch available carats for this product
        const caratsResponse = await axios.get(`/api/products/${id}/carats`);
      setAvailableCarats(caratsResponse.data);
      
      // Set default carat (find the one marked as default or first one)
      const defaultIndex = caratsResponse.data.findIndex(carat => carat.is_default);
      if (defaultIndex >= 0) {
        setSelectedCaratIndex(defaultIndex);
      }
      
      // Fetch related products from the same category
      if (response.data.category_id) {
        const relatedResponse = await axios.get(`/api/products?category_id=${response.data.category_id}&limit=4`);
        setRelatedProducts(relatedResponse.data.filter(p => p.id !== parseInt(id)));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async (caratIndex) => {
    if (!selectedCaratIndex || !product || availableCarats.length === 0) return;
    
    setPriceLoading(true);
    try {
      const selectedCarat = availableCarats[caratIndex];
      const response = await axios.get(`/api/products/${id}/price/${selectedCarat.carat_weight}`, {
        params: { carat_pricing_id: selectedCarat.carat_pricing_id }
      });
      setCurrentPrice(response.data);
    } catch (error) {
      console.error('Error calculating price:', error);
      // Fallback calculation
      const basePrice = product.base_price || product.price || 0;
      const discountMultiplier = product.discount_percentage ? (1 - product.discount_percentage / 100) : 1;
      const caratMultiplier = selectedCaratIndex >= 0 && availableCarats[selectedCaratIndex] ? availableCarats[selectedCaratIndex].carat_weight : 1;
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL').format(Math.round(price));
  };

  const handleAddToCart = () => {
    if (availableCarats.length > 0 && selectedCaratIndex < 0) {
      console.error('אנא בחר גודל קראט');
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
    console.log('המוצר נוסף לעגלה בהצלחה!');
  };

  const toggleFavorite = () => {
    const isFavorite = favorites.some(fav => fav.id === product.id);
    if (isFavorite) {
      removeFromFavorites(product.id);
      console.log('המוצר הוסר מהמועדפים');
    } else {
      addToFavorites(product);
      console.log('המוצר נוסף למועדפים');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Diamond className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">טוען פרטי מוצר...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Diamond className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">מוצר לא נמצא</h2>
          <p className="text-gray-600 mb-8">המוצר שחיפשת לא קיים או הוסר מהמערכת</p>
          <Link to="/products" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full transition-colors">
            חזור למוצרים
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

      {/* Ultra Clean Styles */}
      <style jsx="true">{`
        .ultra-clean-card {
          background: white;
          border-radius: 0;
          box-shadow: none;
          border: none;
        }
        
        .category-pill {
          background: linear-gradient(135deg, #fef3c7, #fcd34d);
          color: #92400e;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        
        .metal-button {
          width: 70px;
          height: 36px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 14px;
          color: #6b7280;
        }
        
        .metal-button.selected {
          background: #d4af37;
          border-color: #d4af37;
          color: white;
        }

        .carat-button {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 80px;
        }
        
        .carat-button.selected {
          border-color: #d4af37;
          background: #fef3c7;
          box-shadow: 0 0 0 1px #d4af37;
        }
        
        .carat-button:hover {
          border-color: #d4af37;
          background: #fefbf0;
        }
        
        .carat-weight {
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
        }
        
        .carat-price {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .carat-price.loading {
          color: #d4af37;
        }
        
        .collapsible-section {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        .collapsible-header {
          background: white;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s ease;
        }
        
        .collapsible-header:hover {
          background: #f9fafb;
        }
        
        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          background: white;
        }
        
        .spec-row:last-child {
          border-bottom: none;
        }
        
        .spec-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4b5563;
          font-size: 14px;
        }
        
        .spec-value {
          color: #111827;
          font-weight: 600;
          font-size: 16px;
        }
        
        .help-icon {
          width: 16px;
          height: 16px;
          color: #d4af37;
          cursor: help;
        }
        
        .image-container {
          background: white;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 500px;
        }
        
        .breadcrumb-container {
          background: white;
          border-bottom: 1px solid #f1f5f9;
          padding: 16px 0;
        }

        .price-display {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .original-price {
          text-decoration: line-through;
          color: #94a3b8;
          font-size: 18px;
          margin-bottom: 4px;
        }

        .current-price {
          font-size: 32px;
          font-weight: 300;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .discount-badge {
          background: #dc2626;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 8px;
        }

        .carat-info {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .metal-button {
            width: 60px;
            height: 32px;
            font-size: 12px;
          }
          
          .image-container {
            padding: 16px;
            min-height: 300px;
          }

          .carat-button {
            min-width: 70px;
            padding: 10px 12px;
          }

          .current-price {
            font-size: 28px;
          }
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">דף הבית</Link>
            <ArrowRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-gray-900">מוצרים</Link>
            <ArrowRight className="w-4 h-4" />
            {product.category && (
              <>
                <span className="hover:text-gray-900">{product.category.name}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Display */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="image-container">
            <ProductImageGallery 
              images={product.images || product.image_url} 
              productName={product.name}
            />
          </div>

          {/* Product Details */}
            <div className="bg-white p-8 h-fit">
            {/* Category Badge - More minimal */}
            {product.category && (
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Diamond className="w-4 h-4 text-yellow-500" />
                {product.category.name}
              </div>
            )}

            {/* Product Title - Clean and bold */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
              {product.name}
            </h1>

            {/* Ring Size Selection - Clean minimal style */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">מידת טבעת</h3>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="6"
                >
                  <option value="5">5</option>
                  <option value="5.5">5.5</option>
                  <option value="6">6</option>
                  <option value="6.5">6.5</option>
                  <option value="7">7</option>
                  <option value="7.5">7.5</option>
                  <option value="8">8</option>
                  <option value="8.5">8.5</option>
                  <option value="9">9</option>
                  <option value="9.5">9.5</option>
                  <option value="10">10</option>
                  <option value="10.5">10.5</option>
                  <option value="11">11</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Metal Color Selection - Clean minimal style */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">צבע מתכת</h3>
              <div className="flex gap-3">
                <button
                  className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: '#F8D1C2' }}
                  title="זהב ורוד"
                />
                <button
                  className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: '#D4A574' }}
                  title="זהב צהוב"
                />
                <button
                  className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: '#E8B4A0' }}
                  title="זהב ורוד בהיר"
                />
                <button
                  className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: '#FFD700' }}
                  title="זהב"
                />
                <button
                  className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: '#C0C0C0' }}
                  title="כסף"
                />
                <button
                  className="w-12 h-12 rounded-full border-3 border-gray-800 hover:border-gray-600 transition-colors bg-white"
                  title="זהב לבן"
                />
              </div>
            </div>

            {/* Carat Selection - Keep core functionality with clean design */}
            {availableCarats.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">בחירת קראט ({availableCarats.length} אפשרויות)</h3>
                <div className="grid grid-cols-3 gap-3">
                  {availableCarats.map((carat, index) => (
                    <button
                      key={carat.carat_pricing_id}
                      onClick={() => handleCaratChange(index)}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        selectedCaratIndex === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{carat.carat_weight}</div>
                      <div className="text-sm text-gray-500">
                        {priceLoading && selectedCaratIndex === index ? 'מחשב...' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Display - Clean style like the target image */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {currentPrice ? `₪${formatPrice(currentPrice)}` : '₪8,750'}
                </span>
                <span className="text-lg text-gray-500">(כולל מע"מ ומשלוח חינם)</span>
              </div>
              {availableCarats.length > 0 && selectedCaratIndex >= 0 && (
                <div className="text-sm text-gray-600 mt-2">
                  קראט: {availableCarats[selectedCaratIndex]?.carat_weight} | מתכת: {selectedMetal} | צבע לבן | מידה: 6
                </div>
              )}
            </div>

            {/* Diamond Specifications */}
            <div className="mb-6">
              {product.color_grade && (
                <div className="spec-row">
                  <div className="spec-label">
                    <HelpCircle className="help-icon" />
                    <span>צבע</span>
                  </div>
                  <div className="spec-value">{product.color_grade}</div>
                </div>
              )}
              
              {product.clarity_grade && (
                <div className="spec-row">
                  <div className="spec-label">
                    <HelpCircle className="help-icon" />
                    <span>ניקיון</span>
                  </div>
                  <div className="spec-value">{product.clarity_grade}</div>
                </div>
              )}

              {product.cut_grade && (
                <div className="spec-row">
                  <div className="spec-label">
                    <HelpCircle className="help-icon" />
                    <span>חיתוך</span>
                  </div>
                  <div className="spec-value">{product.cut_grade}</div>
                </div>
              )}

              {product.shape && (
                <div className="spec-row">
                  <div className="spec-label">
                    <HelpCircle className="help-icon" />
                    <span>צורה</span>
                  </div>
                  <div className="spec-value">{product.shape}</div>
                </div>
              )}
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="mt-6">
              <button 
                onClick={handleAddToCart}
                disabled={availableCarats.length > 0 && selectedCaratIndex < 0}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors mb-3 ${
                  selectedCaratIndex >= 0 ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedCaratIndex >= 0 ? 'הוספה לסל' : 'בחר קראט כדי להוסיף לסל'}
              </button>
              
              <button
                onClick={toggleFavorite}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-3 ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
              </button>
            </div>

            {/* WhatsApp Contact - Minimal */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <img 
                      src="/api/placeholder/40/40" 
                      alt="יועץ יהלומים" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">מעוניין/ת בתיאור המוצר?</div>
                    <div className="text-xs text-gray-600">נכנס ליצור בוואטסאפ (מענה אנושי מיידי)</div>
                  </div>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Benefits - Minimal */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-600">
                <div className="flex flex-col items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>משלוח חינם</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>החזרה תוך 30 יום</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>אחריות מלאה</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Suggestions - Clean & Minimal */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light text-gray-900">עוד מהקטגוריה</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 8).map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.id}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 relative"
                  >
                    {/* Heart Icon */}
                    <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                    
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <ProductImageGallery 
                        images={relatedProduct.images || relatedProduct.image_url} 
                        productName={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        showNavigation={false}
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-relaxed">
                        {relatedProduct.name}
                      </h3>
                      <div className="text-lg font-semibold text-amber-600">
                        ₪{(relatedProduct.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {product.category && (
                <div className="text-center mt-8">
                  <Link 
                    to={`/products?category=${product.category.id}`}
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    <Diamond className="w-5 h-5" />
                    צפה בכל המוצרים בקטגוריה
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 