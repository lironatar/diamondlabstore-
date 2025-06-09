import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Gem, Plus, Trash2, Star, Check, X } from 'lucide-react';

const ProductCaratManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableCarats, setAvailableCarats] = useState([]);
  const [allCaratPricing, setAllCaratPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchAllCaratPricing();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/api/products?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCaratPricing = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/api/carat-pricing', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllCaratPricing(response.data);
    } catch (error) {
      console.error('Error fetching carat pricing:', error);
    }
  };

  const fetchProductCarats = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`/api/products/${productId}/carats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableCarats(response.data);
    } catch (error) {
      console.error('Error fetching product carats:', error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    fetchProductCarats(product.id);
  };

  const addCaratToProduct = async (caratWeight) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`/api/products/${selectedProduct.id}/carats`, {
        carat_weight: caratWeight,
        is_available: true,
        is_default: availableCarats.length === 0, // First carat becomes default
        sort_order: availableCarats.length + 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchProductCarats(selectedProduct.id);
    } catch (error) {
      console.error('Error adding carat to product:', error);
      alert('שגיאה בהוספת הקראט למוצר');
    }
  };

  const removeCaratFromProduct = async (caratId) => {
    if (!confirm('האם אתה בטוח שברצונך להסיר קראט זה מהמוצר?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`/api/products/${selectedProduct.id}/carats/${caratId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchProductCarats(selectedProduct.id);
    } catch (error) {
      console.error('Error removing carat from product:', error);
      alert('שגיאה בהסרת הקראט מהמוצר');
    }
  };

  const setDefaultCarat = async (caratWeight) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`/api/products/${selectedProduct.id}/carats/${caratWeight}/set-default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchProductCarats(selectedProduct.id);
    } catch (error) {
      console.error('Error setting default carat:', error);
      alert('שגיאה בהגדרת קראט ברירת מחדל');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailableCaratsToAdd = () => {
    const usedCarats = availableCarats.map(ac => ac.carat_weight);
    return allCaratPricing.filter(cp => !usedCarats.includes(cp.carat_weight));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Gem className="w-12 h-12 text-gold animate-pulse mx-auto mb-4" />
          <p>טוען מוצרים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <style jsx="true">{`
        .text-gold { color: #d4af37; }
        .bg-gold { background-color: #d4af37; }
        .border-gold { border-color: #d4af37; }
        .hover\\:bg-gold:hover { background-color: #d4af37; }
        .focus\\:border-gold:focus { border-color: #d4af37; }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Gem className="w-6 h-6 text-gold" />
        <h2 className="text-2xl font-bold text-gray-900">ניהול קראטים למוצרים</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">בחר מוצר</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="חפש מוצר..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedProduct?.id === product.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image_url || '/api/placeholder/60/60'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                    <p className="text-sm text-gray-500">₪{product.price?.toLocaleString()}</p>
                  </div>
                  {selectedProduct?.id === product.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carat Management */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {selectedProduct ? (
            <>
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  קראטים זמינים עבור: {selectedProduct.name}
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Current Carats */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">קראטים קיימים</h4>
                  {availableCarats.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Gem className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>לא הוגדרו קראטים למוצר זה</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableCarats.map((carat) => (
                        <div
                          key={carat.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Gem className="w-4 h-4 text-gold" />
                            <span className="font-medium">{carat.carat_weight} קראט</span>
                            {carat.is_default && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                ברירת מחדל
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!carat.is_default && (
                              <button
                                onClick={() => setDefaultCarat(carat.carat_weight)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                title="הגדר כברירת מחדל"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => removeCaratFromProduct(carat.id)}
                              className="text-red-600 hover:text-red-800"
                              title="הסר קראט"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Carats */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">הוסף קראטים</h4>
                  {getAvailableCaratsToAdd().length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>כל הקראטים הזמינים כבר נוספו למוצר</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableCaratsToAdd().map((caratPricing) => (
                        <button
                          key={caratPricing.id}
                          onClick={() => addCaratToProduct(caratPricing.carat_weight)}
                          className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:border-gold hover:bg-gold hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          {caratPricing.carat_weight} קראט
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">פעולות מהירות</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Add all available carats
                        getAvailableCaratsToAdd().forEach(cp => {
                          addCaratToProduct(cp.carat_weight);
                        });
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                      disabled={getAvailableCaratsToAdd().length === 0}
                    >
                      הוסף את כל הקראטים
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Gem className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">בחר מוצר מהרשימה כדי לנהל את הקראטים שלו</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCaratManager; 