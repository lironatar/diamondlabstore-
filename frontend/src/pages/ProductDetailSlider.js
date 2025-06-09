import React, { useState, useEffect } from 'react';
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
  Check,
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  Award,
  Diamond
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
      const basePrice = product.base_price || product.price || 0;
      const discountMultiplier = product.discount_percentage ? (1 - product.discount_percentage / 100) : 1;
      const caratMultiplier = selectedCarat.carat_weight || 1;
      const fallbackPrice = Math.round(basePrice * caratMultiplier * discountMultiplier);
      setCurrentPrice(fallbackPrice);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleCaratChange = (caratIndex) => {
    setSelectedCaratIndex(caratIndex);
    calculatePrice(caratIndex);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center" dir="rtl">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-3xl font-light text-slate-800 mb-6">היצירה לא נמצאה</h2>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            חזרה לאוסף
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.id === product.id);

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
        <div className="max-w-7xl mx-auto px-6 py-4">
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Product Images */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
              <ProductImageGallery 
                images={product.images || product.image_url} 
                productName={product.name}
                className="w-full aspect-square rounded-2xl"
              />
            </div>
            
            {/* Quality Badges */}
            <div className="absolute top-6 right-6 space-y-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Diamond className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-light text-slate-900 leading-tight mb-3">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                      <span className="mr-2 text-sm text-slate-600 font-light">(127 ביקורות)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              {priceLoading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse text-2xl font-light text-amber-600">מחשב מחיר...</div>
                </div>
              ) : (
                <div className="text-center">
                  {product.discount_percentage && (
                    <div className="text-sm text-slate-500 line-through mb-1 font-light">
                      ₪{(currentPrice / (1 - product.discount_percentage / 100)).toLocaleString()}
                    </div>
                  )}
                  <div className="text-4xl font-light text-slate-900 mb-2">
                    ₪{(currentPrice || 0).toLocaleString()}
                  </div>
                  {product.discount_percentage && (
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      חסכון של {product.discount_percentage}%
                    </div>
                  )}
                  <p className="text-sm text-slate-600 mt-2 font-light">כולל מע״ם ומשלוח חינם</p>
                </div>
              )}
            </div>

            {/* Carat Selection */}
            {availableCarats.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Gem className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-medium text-slate-900">בחירת קראט</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {availableCarats.map((carat, index) => (
                    <button
                      key={carat.id}
                      onClick={() => handleCaratChange(index)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                        index === selectedCaratIndex
                          ? 'border-amber-400 bg-amber-50 shadow-lg'
                          : 'border-slate-200 bg-white hover:border-amber-200 hover:shadow-md'
                      }`}
                    >
                      <div className="font-medium text-slate-900">{carat.carat_weight}</div>
                      <div className="text-xs text-slate-600 font-light">קראט</div>
                      {index === selectedCaratIndex && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {selectedCaratIndex >= 0 && availableCarats[selectedCaratIndex] && (
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <span className="text-slate-700 font-light">
                      נבחר: {availableCarats[selectedCaratIndex].carat_weight} קראט
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={availableCarats.length > 0 && selectedCaratIndex < 0}
                className="w-full bg-slate-900 text-white py-4 px-8 rounded-full font-medium hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {availableCarats.length > 0 && selectedCaratIndex < 0 ? 'בחר קראט כדי להוסיף לעגלה' : 'הוסף לעגלה'}
              </button>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm">
                  <Truck className="w-6 h-6 text-amber-600" />
                  <span className="text-sm font-light text-slate-700">משלוח חינם</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-light text-slate-700">אחריות מלאה</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm">
                  <RotateCcw className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-light text-slate-700">החזרה חינם</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-slate-900 mb-4">אודות היצירה</h3>
              <p className="text-slate-700 leading-relaxed font-light">
                {product.description || 'יצירת אמנות יהלומים מעוצבת ברמה הגבוהה ביותר. כל יהלום נבחר בקפידה ומעובד בטכנולוגיה מתקדמת. מושלם לאירועים מיוחדים או כהשקעה יוקרתית לעתיד.'}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-slate-900 mb-4">יצירות דומות</h2>
              <p className="text-slate-600 font-light">המלצות מותאמות אישית מהאוסף שלנו</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/products/${relatedProduct.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-slate-50">
                    <img
                      src={Array.isArray(relatedProduct.images) ? relatedProduct.images[0] : relatedProduct.image_url || "/api/placeholder/400/400"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-xl font-light text-slate-800">
                      החל מ ₪{(relatedProduct.price || 0).toLocaleString()}
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