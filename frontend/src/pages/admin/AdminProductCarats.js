import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Search, Package, Gem, Plus, X, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminProductCarats = () => {
  const [products, setProducts] = useState([]);
  const [caratPricings, setCaratPricings] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productCarats, setProductCarats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, caratPricingRes] = await Promise.all([
        axios.get('/products'),
        axios.get('/carat-pricing')
      ]);
      
      setProducts(productsRes.data);
      setCaratPricings(caratPricingRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('שגיאה בטעינת הנתונים');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductCarats = async (productId) => {
    try {
      const response = await axios.get(`/products/${productId}/carats`);
      setProductCarats(response.data);
    } catch (error) {
      console.error('Error fetching product carats:', error);
      toast.error('שגיאה בטעינת קראטי המוצר');
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    fetchProductCarats(product.id);
  };

  const addCaratToProduct = async (caratId) => {
    try {
      await axios.post(`/products/${selectedProduct.id}/carats`, {
        carat_pricing_id: caratId
      });
      toast.success('קראט נוסף למוצר בהצלחה');
      fetchProductCarats(selectedProduct.id);
    } catch (error) {
      console.error('Error adding carat to product:', error);
      toast.error('שגיאה בהוספת קראט למוצר');
    }
  };

  const removeCaratFromProduct = async (caratId) => {
    try {
      await axios.delete(`/products/${selectedProduct.id}/carats/${caratId}`);
      toast.success('קראט הוסר מהמוצר בהצלחה');
      fetchProductCarats(selectedProduct.id);
    } catch (error) {
      console.error('Error removing carat from product:', error);
      toast.error('שגיאה בהסרת קראט מהמוצר');
    }
  };

  const setDefaultCarat = async (caratId) => {
    try {
      await axios.put(`/products/${selectedProduct.id}/default-carat`, {
        carat_pricing_id: caratId
      });
      toast.success('קראט ברירת מחדל עודכן בהצלחה');
      fetchProductCarats(selectedProduct.id);
    } catch (error) {
      console.error('Error setting default carat:', error);
      toast.error('שגיאה בהגדרת קראט ברירת מחדל');
    }
  };

  const addAllCarats = async () => {
    try {
      await axios.post(`/products/${selectedProduct.id}/carats/all`);
      toast.success('כל הקראטים נוספו למוצר בהצלחה');
      fetchProductCarats(selectedProduct.id);
    } catch (error) {
      console.error('Error adding all carats:', error);
      toast.error('שגיאה בהוספת כל הקראטים');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCarats = caratPricings.filter(carat =>
    !productCarats.some(pc => pc.carat_pricing_id === carat.id)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">טוען נתוני קראטים למוצרים...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <style jsx="true">{`
        .text-gold { color: #d4af37; }
        .bg-gold { background-color: #d4af37; }
        .border-gold { border-color: #d4af37; }
        .hover\\:bg-gold:hover { background-color: #d4af37; }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ניהול קראטים למוצרים</h1>
              <p className="text-gray-600">הגדר אילו קראטים זמינים לכל מוצר</p>
            </div>
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              חזרה לדף הבקרה
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">בחירת מוצר</h2>
            </div>
            
            {/* Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חפש מוצר..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
                    selectedProduct?.id === product.id
                      ? 'bg-yellow-50 border-gold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 ml-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">מחיר בסיס: ₪{product.base_price?.toLocaleString() || product.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">לא נמצאו מוצרים</p>
              </div>
            )}
          </div>

          {/* Carat Management */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProduct ? `קראטים עבור: ${selectedProduct.name}` : 'בחר מוצר'}
              </h2>
            </div>

            {selectedProduct ? (
              <div className="p-6">
                {/* Action Buttons */}
                <div className="mb-6">
                  <button
                    onClick={addAllCarats}
                    className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    הוסף את כל הקראטים
                  </button>
                </div>

                {/* Current Carats */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">קראטים זמינים למוצר זה:</h3>
                  {productCarats.length > 0 ? (
                    <div className="space-y-2">
                      {productCarats.map((pc) => {
                        const carat = caratPricings.find(c => c.id === pc.carat_pricing_id);
                        return (
                          <div key={pc.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                              <Gem className="w-4 h-4 text-gold ml-2" />
                              <span className="font-medium">
                                {carat?.carat_weight} קראט
                                {pc.is_default && (
                                  <span className="bg-gold text-white text-xs px-2 py-1 rounded-full mr-2">
                                    ברירת מחדל
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {!pc.is_default && (
                                <button
                                  onClick={() => setDefaultCarat(carat.id)}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  הגדר כברירת מחדל
                                </button>
                              )}
                              <button
                                onClick={() => removeCaratFromProduct(carat.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">אין קראטים זמינים למוצר זה</p>
                  )}
                </div>

                {/* Available Carats to Add */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">קראטים זמינים להוספה:</h3>
                  {availableCarats.length > 0 ? (
                    <div className="space-y-2">
                      {availableCarats.map((carat) => (
                        <div key={carat.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <Gem className="w-4 h-4 text-gray-400 ml-2" />
                            <span>{carat.carat_weight} קראט (×{carat.price_multiplier})</span>
                          </div>
                          <button
                            onClick={() => addCaratToProduct(carat.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                          >
                            הוסף
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">כל הקראטים כבר זמינים למוצר זה</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">בחר מוצר</h3>
                <p className="text-gray-500">בחר מוצר מהרשימה כדי לנהל את הקראטים שלו</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Gem className="w-6 h-6 text-blue-600 ml-3 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">איך לנהל קראטים למוצרים?</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• בחר מוצר מהרשימה משמאל כדי לראות את הקראטים הזמינים לו</li>
                <li>• הוסף קראטים בודדים או לחץ "הוסף את כל הקראטים" להוספה מהירה</li>
                <li>• הגדר קראט אחד כברירת מחדל - זה יוצג ללקוח כאשר הוא נכנס לעמוד המוצר</li>
                <li>• ללא קראטים זמינים, הלקוח יראה רק את המחיר הבסיסי</li>
                <li>• המחיר יתעדכן אוטומטית בהתאם לקראט שהלקוח בוחר</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCarats; 