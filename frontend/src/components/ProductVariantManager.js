import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, X, Save, Trash2, Palette, Image as ImageIcon } from 'lucide-react';
import MultiImageUpload from './MultiImageUpload';

// Predefined color options for jewelry
const JEWELRY_COLORS = [
  { name: 'זהב', nameEn: 'Gold', code: '#FFD700' },
  { name: 'כסף', nameEn: 'Silver', code: '#C0C0C0' },
  { name: 'ברונזה', nameEn: 'Bronze', code: '#CD7F32' }
];

const ProductVariantManager = ({ productId, variants = [], onVariantsChange }) => {
  const [editingVariants, setEditingVariants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
    color_name: '',
    color_code: '',
    images: [],
    is_default: false,
    sort_order: 0
  });

  // Debug logs
  useEffect(() => {
    console.log('ProductVariantManager mounted with:', { productId, variants });
  }, [productId, variants]);

  useEffect(() => {
    console.log('Setting editing variants:', variants);
    setEditingVariants(variants.map(v => ({ ...v })));
  }, [variants]);

  const handleAddVariant = async (e) => {
    // Prevent any form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      console.log('🔥 Starting handleAddVariant');
      console.log('ProductID:', productId);
      console.log('New Variant Data:', newVariant);
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('Auth token present:', !!token);
      if (!token) {
        console.log('❌ No authentication token found');
        toast.error('אנא התחבר כמנהל כדי להוסיף גרסאות צבע');
        return;
      }
      
      // Validate required fields
      if (!newVariant.color_name.trim()) {
        console.log('❌ Validation failed: color_name is empty');
        toast.error('נא להזין שם צבע');
        return;
      }
      
      if (!newVariant.color_code) {
        console.log('❌ Validation failed: color_code is empty');
        toast.error('נא לבחור קוד צבע');
        return;
      }

      if (!productId) {
        console.log('❌ Validation failed: productId is missing');
        toast.error('שגיאה: מזהה מוצר חסר');
        return;
      }

      console.log('✅ Validation passed, making API call...');
      
      const apiUrl = `/api/products/${productId}/variants`;
      console.log('API URL:', apiUrl);
      console.log('Request headers:', axios.defaults.headers.common);
      
      // Make the API call with explicit headers
      const response = await axios.post(apiUrl, newVariant, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ API Response:', response.data);
      
      const updatedVariants = [...editingVariants, response.data];
      console.log('✅ Updated variants list:', updatedVariants);
      
      setEditingVariants(updatedVariants);
      
      if (onVariantsChange) {
        console.log('✅ Calling onVariantsChange callback');
        onVariantsChange(updatedVariants);
      }
      
      setNewVariant({
        color_name: '',
        color_code: '',
        images: [],
        is_default: false,
        sort_order: editingVariants.length
      });
      setShowAddForm(false);
      console.log('✅ Variant added successfully!');
      toast.success('גרסת צבע נוספה בהצלחה');
    } catch (error) {
      console.error('❌ Error in handleAddVariant:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
        url: error.config?.url,
        method: error.config?.method
      });
      
      let errorMessage = 'שגיאה לא ידועה';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'אנא התחבר מחדש כמנהל';
        } else if (error.response.status === 403) {
          errorMessage = 'אין לך הרשאות מנהל';
        } else if (error.response.status === 404) {
          errorMessage = 'המוצר לא נמצא';
        } else {
          errorMessage = error.response.data?.detail || `שגיאת שרת: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'שגיאת רשת: לא הגיעה תגובה מהשרת. ודא שהשרת רץ על פורט 8001';
      } else {
        // Something else happened
        errorMessage = error.message;
      }
      
      toast.error(`שגיאה בהוספת גרסת הצבע: ${errorMessage}`);
    }
  };

  const handleUpdateVariant = async (variantId, updatedData, e = null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      console.log('Updating variant:', variantId, updatedData); // Debug log
      
      const response = await axios.put(`/api/products/${productId}/variants/${variantId}`, updatedData);
      console.log('Variant updated successfully:', response.data); // Debug log
      
      const updatedVariants = editingVariants.map(v => 
        v.id === variantId ? response.data : v
      );
      setEditingVariants(updatedVariants);
      onVariantsChange?.(updatedVariants);
      toast.success('גרסת הצבע עודכנה בהצלחה');
    } catch (error) {
      console.error('Error updating variant:', error);
      console.error('Error response:', error.response?.data); // Debug log
      const errorMessage = error.response?.data?.detail || error.message || 'שגיאה לא ידועה';
      toast.error(`שגיאה בעדכון גרסת הצבע: ${errorMessage}`);
    }
  };

  const handleDeleteVariant = async (variantId, e = null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!window.confirm('האם אתה בטוח שברצונך למחוק גרסת צבע זו?')) {
      return;
    }

    try {
      console.log('Deleting variant:', variantId); // Debug log
      
      await axios.delete(`/api/products/${productId}/variants/${variantId}`);
      console.log('Variant deleted successfully'); // Debug log
      
      const updatedVariants = editingVariants.filter(v => v.id !== variantId);
      setEditingVariants(updatedVariants);
      onVariantsChange?.(updatedVariants);
      toast.success('גרסת הצבע נמחקה בהצלחה');
    } catch (error) {
      console.error('Error deleting variant:', error);
      console.error('Error response:', error.response?.data); // Debug log
      const errorMessage = error.response?.data?.detail || error.message || 'שגיאה לא ידועה';
      toast.error(`שגיאה במחיקת גרסת הצבע: ${errorMessage}`);
    }
  };

  const VariantForm = ({ variant, isNew = false, onSave, onCancel }) => {
    const [formData, setFormData] = useState(variant);

    const handleSave = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      if (!formData.color_name.trim()) {
        toast.error('נא לבחור צבע');
        return;
      }
      
      if (!formData.color_code) {
        toast.error('נא לבחור צבע');
        return;
      }
      
      console.log('Form data to save:', formData); // Debug log
      onSave(formData, e);
    };

    const handleCancel = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      onCancel();
    };

    const handleColorChange = (selectedColor) => {
      setFormData({
        ...formData,
        color_name: selectedColor.name,
        color_code: selectedColor.code
      });
    };

    // Get available colors (exclude colors that are already used)
    const usedColors = editingVariants.map(v => v.color_name);
    const availableColors = JEWELRY_COLORS.filter(color => 
      !usedColors.includes(color.name) || formData.color_name === color.name
    );

    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              בחר צבע תכשיט *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColorChange(color);
                  }}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3
                    ${formData.color_name === color.name 
                      ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                  `}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-inner"
                    style={{ backgroundColor: color.code }}
                  />
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{color.name}</div>
                    <div className="text-sm text-gray-500">{color.nameEn}</div>
                  </div>
                  {formData.color_name === color.name && (
                    <div className="mr-auto">
                      <div className="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {availableColors.length === 0 && (
              <p className="text-amber-600 text-sm mt-2 p-3 bg-amber-50 rounded-lg">
                כל הצבעים הזמינים כבר נוספו למוצר זה
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תמונות לגרסה זו
            </label>
            <MultiImageUpload
              value={formData.images?.map(url => ({ image_url: url, url })) || []}
              onChange={(images) => {
                const imageUrls = images.map(img => img.image_url || img.url);
                setFormData({ ...formData, images: imageUrls });
              }}
              maxFiles={6}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">גרסת ברירת מחדל</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSave(e);
              }}
              disabled={!formData.color_name || availableColors.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isNew ? 'הוסף גרסה' : 'שמור שינויים'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCancel(e);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <X className="w-4 h-4" />
              ביטול
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-yellow-500" />
          גרסאות צבע
        </h3>
        
        {/* Show different button states based on available colors */}
        {(() => {
          const usedColors = editingVariants.map(v => v.color_name);
          const availableColors = JEWELRY_COLORS.filter(color => !usedColors.includes(color.name));
          
          if (availableColors.length === 0) {
            return (
              <div className="text-sm text-gray-600">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  כל הצבעים נוספו ✓
                </span>
              </div>
            );
          } else {
            return (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAddForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                type="button"
              >
                <Plus className="w-4 h-4" />
                הוסף גרסת צבע ({availableColors.length} זמינים)
              </button>
            );
          }
        })()}
      </div>

      {editingVariants.length === 0 && !showAddForm && (
        <div className="text-center py-8">
          <Palette className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין גרסאות צבע למוצר זה</h3>
          <p className="text-gray-600 mb-6">הוסף גרסאות צבע כדי לאפשר ללקוחות לבחור בין אפשרויות שונות</p>
          
          {/* Available colors preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">צבעים זמינים:</h4>
            <div className="flex justify-center gap-4">
              {JEWELRY_COLORS.map((color) => (
                <div key={color.name} className="text-center">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-lg mx-auto mb-1 relative"
                    style={{ backgroundColor: color.code }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">{color.name}</div>
                  <div className="text-xs text-gray-400">{color.nameEn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Existing Variants */}
      {editingVariants.map((variant, index) => {
        const colorInfo = JEWELRY_COLORS.find(c => c.name === variant.color_name);
        const displayColor = colorInfo ? colorInfo.code : variant.color_code;
        
        return (
          <div key={variant.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-3 border-gray-300 shadow-lg relative"
                  style={{ backgroundColor: displayColor }}
                >
                  {/* Inner shine effect for metallic look */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    {variant.color_name}
                    {colorInfo && (
                      <span className="text-sm text-gray-500">({colorInfo.nameEn})</span>
                    )}
                    {variant.is_default && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        ברירת מחדל
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {variant.images?.length || 0} תמונות
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateVariant(variant.id, variant, e);
                  }}
                  className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                  title="ערוך גרסה"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteVariant(variant.id, e);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="מחק גרסה"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {variant.images && variant.images.length > 0 && (
              <div className="grid grid-cols-6 gap-2 mt-3">
                {variant.images.slice(0, 6).map((imageUrl, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:8001${imageUrl}`}
                    alt={`${variant.color_name} ${imgIndex + 1}`}
                    className="w-full h-16 object-cover rounded border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add New Variant Form */}
      {showAddForm && (
        <div onClick={(e) => e.stopPropagation()}>
          <VariantForm
            variant={newVariant}
            isNew={true}
            onSave={(formData, e) => {
              console.log('onSave called with:', formData);
              handleAddVariant(e);
            }}
            onCancel={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              setShowAddForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductVariantManager; 