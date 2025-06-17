import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Image, Save, X, Diamond, Settings, Eye, Star, Package, DollarSign, Tag, Gem } from 'lucide-react';
import MultiImageUpload from '../../components/MultiImageUpload';
import ProductImageGallery from '../../components/ProductImageGallery';
import ProductVariantManager from '../../components/ProductVariantManager';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const formRef = useRef(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('שגיאה בטעינת הקטגוריות');
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Submitting form data:', data);
      console.log('Editing product:', editingProduct);
      console.log('Product images:', productImages);
      
      // Validate required fields
      if (!data.name || !data.price || !data.category_id) {
        toast.error('אנא מלא את כל השדות החובה');
        return;
      }
      
      // Convert numeric fields with validation
      const price = parseFloat(data.price);
      const categoryId = parseInt(data.category_id);
      
      if (isNaN(price) || price <= 0) {
        toast.error('מחיר חייב להיות מספר חיובי');
        return;
      }
      
      if (isNaN(categoryId) || categoryId <= 0) {
        toast.error('אנא בחר קטגוריה תקינה');
        return;
      }
      
      const productData = {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        price: price,
        base_price: price, // Set base_price same as price for now
        carat_weight: data.carat_weight ? parseFloat(data.carat_weight) : null,
        color_grade: data.color_grade || null,
        clarity_grade: data.clarity_grade || null,
        cut_grade: data.cut_grade || null,
        shape: data.shape || null,
        certificate_number: data.certificate_number?.trim() || null,
        category_id: categoryId,
        is_featured: Boolean(data.is_featured),
        discount_percentage: data.discount_percentage ? parseFloat(data.discount_percentage) : 0
      };

      // Set primary image URL if images exist
      if (productImages.length > 0) {
        const primaryImage = productImages.find(img => img.is_primary) || productImages[0];
        productData.image_url = primaryImage.image_url || primaryImage.url;
      }

      console.log('Processed product data:', productData);
      console.log('Product data JSON:', JSON.stringify(productData, null, 2));

      let productId;
      let isNewProduct = false;
      
      if (editingProduct) {
        console.log(`Updating product with ID: ${editingProduct.id}`);
        console.log('PUT request URL:', `/api/products/${editingProduct.id}`);
        const response = await axios.put(`/api/products/${editingProduct.id}`, productData);
        console.log('Update response:', response.data);
        productId = editingProduct.id;
        
        toast.success('המוצר עודכן בהצלחה');
      } else {
        console.log('Creating new product');
        console.log('POST request URL:', '/api/products');
        const response = await axios.post('/api/products', productData);
        console.log('Create response:', response.data);
        productId = response.data.id;
        isNewProduct = true;
        
        toast.success('המוצר נוצר בהצלחה! מעביר לדף המוצרים...');
      }
      
      // For both new and existing products, save/update images
      if (productImages.length > 0) {
        console.log('Saving images for product:', productId);
        for (const image of productImages) {
          // Skip images that are already saved (have a numeric ID from the database)
          if (typeof image.id === 'number') {
            console.log('Skipping existing image with ID:', image.id);
            continue;
          }
          
          try {
            console.log('Saving new image:', image.image_url || image.url);
            await axios.post(`/api/products/${productId}/images`, {
              image_url: image.image_url || image.url,
              alt_text: image.alt_text || '',
              is_primary: image.is_primary || false,
              sort_order: image.sort_order || 0
            });
            console.log('Successfully saved image:', image.image_url || image.url);
            toast.success('תמונה נשמרה בהצלחה');
          } catch (imageError) {
            console.error('Failed to save image:', imageError);
            toast.error('שגיאה בשמירת תמונה');
          }
        }
      }
      
      reset();
      setShowForm(false);
      setEditingProduct(null);
      setProductImages([]);
      
      // If it's a new product, redirect to products page after a short delay
      if (isNewProduct) {
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500); // Give time for the success message to be seen
      } else {
      fetchProducts();
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
      
      // Enhanced error handling based on Axios best practices
      let errorMessage = 'שגיאה לא ידועה';
      if (error.response) {
        // Server responded with error status
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        console.log('Error response headers:', error.response.headers);
        
        if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `שגיאת שרת: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.log('Error request:', error.request);
        errorMessage = 'לא התקבלה תגובה מהשרת';
      } else {
        // Error in request setup
        console.log('Error message:', error.message);
        errorMessage = error.message;
      }
      
      toast.error(editingProduct ? `שגיאה בעדכון המוצר: ${errorMessage}` : `שגיאה ביצירת המוצר: ${errorMessage}`);
    }
  };

  const handleEdit = async (product) => {
    console.log('Edit clicked for product:', product); // Debug log
    try {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('description', product.description || '');
      setValue('price', product.price);
      setValue('image_url', product.image_url || '');
      setValue('carat_weight', product.carat_weight || '');
      setValue('color_grade', product.color_grade || '');
      setValue('clarity_grade', product.clarity_grade || '');
      setValue('cut_grade', product.cut_grade || '');
      setValue('shape', product.shape || '');
      setValue('certificate_number', product.certificate_number || '');
      setValue('category_id', product.category_id);
      setValue('is_featured', product.is_featured || false);
      setValue('discount_percentage', product.discount_percentage || 0);
      
      // Load existing images for the product
      if (product.images && product.images.length > 0) {
        console.log('Loading existing images:', product.images);
        const formattedImages = product.images.map((img, index) => ({
          id: img.id || `existing-${index}`,
          image_url: img.image_url || img.url || img,
          alt_text: img.alt_text || '',
          is_primary: img.is_primary || false,
          sort_order: img.sort_order || index,
          uploaded: true
        }));
        setProductImages(formattedImages);
      } else if (product.image_url) {
        // Handle single image_url field
        setProductImages([{
          id: 'main-image',
          image_url: product.image_url,
          alt_text: product.name,
          is_primary: true,
          sort_order: 0,
          uploaded: true
        }]);
      } else {
        setProductImages([]);
      }
      
      setShowForm(true);
      
      // Auto-scroll to form after a short delay to ensure it's rendered
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
      
      console.log('Edit form opened successfully'); // Debug log
      toast.success(`עורך את המוצר: ${product.name}`);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      toast.error('שגיאה בפתיחת טופס עריכה');
    }
  };

  const handleDelete = async (productId) => {
    const product = products.find(p => p.id === productId);
    const productName = product?.name || 'המוצר';
    
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את ${productName}?\nפעולה זו אינה ניתנת לביטול.`)) return;

    try {
      console.log(`Deleting product with ID: ${productId}`); // Debug log
      await axios.delete(`/api/products/${productId}`);
      toast.success(`${productName} נמחק בהצלחה`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error); // Debug log
      const errorMessage = error.response?.data?.detail || error.message;
      toast.error(`שגיאה במחיקת ${productName}: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setEditingProduct(null);
    setProductImages([]);
  };

  const GlassCard = ({ children, className = "" }) => (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
        <GlassCard className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Diamond className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-light">טוען מוצרים...</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 py-8 px-4" dir="rtl">
      {/* Enhanced Styles */}
      <style jsx="true">{`
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(212, 175, 55, 0.1);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(212, 175, 55, 0.2);
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.2);
        }
        
        /* Mobile Responsive Improvements */
        @media (max-width: 768px) {
          .glass-card {
            border-radius: 20px;
            margin-bottom: 16px;
          }
          
          .glass-card:hover {
            transform: translateY(-2px);
          }
          
          .elegant-button {
            padding: 12px 20px;
            font-size: 16px;
            min-height: 48px;
            border-radius: 12px;
          }
          
          .mobile-product-card {
            padding: 20px;
          }
          
          .mobile-product-image {
            height: 200px;
            border-radius: 16px;
          }
          
          .mobile-product-title {
            font-size: 18px;
            line-height: 1.4;
            margin: 16px 0 12px 0;
          }
          
          .mobile-product-price {
            font-size: 24px;
            margin-bottom: 12px;
          }
          
          .mobile-action-buttons {
            gap: 12px;
            margin-top: 20px;
          }
          
          .mobile-edit-button {
            flex: 1;
            padding: 12px 16px;
            font-size: 16px;
            min-height: 48px;
            border-radius: 12px;
          }
          
          .mobile-delete-button {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .mobile-spec-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .mobile-spec-item {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .mobile-header {
            padding: 20px;
            text-align: center;
          }
          
          .mobile-header h1 {
            font-size: 28px;
            margin-bottom: 12px;
          }
          
          .mobile-add-button {
            width: 100%;
            margin-top: 16px;
            padding: 16px;
            font-size: 18px;
          }
          
          .mobile-form-section {
            padding: 16px;
            margin-bottom: 16px;
          }
          
          .mobile-form-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .elegant-button {
          background: linear-gradient(135deg, #d4af37, #f4e4bc, #d4af37);
          border: 2px solid rgba(212, 175, 55, 0.4);
          color: #8b5a00;
          font-weight: 600;
          letter-spacing: 0.8px;
          transition: all 0.4s ease;
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
          border-radius: 16px;
        }
        
        .elegant-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.6);
          background: linear-gradient(135deg, #e6c558, #f4e4bc, #e6c558);
          border-color: rgba(212, 175, 55, 0.6);
        }
        
        .input-field {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          font-family: 'Heebo', sans-serif;
        }
        
        .input-field:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%);
          margin: 0 auto;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .floating-sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #d4af37;
          border-radius: 50%;
          animation: sparkle 3s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>

      {/* Floating Sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="glass-card mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/admin')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="חזרה לדף הבקרה"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              <div>
                <h1 className="text-2xl font-medium text-gray-900 mb-1 flex items-center">
                  <Diamond className="w-6 h-6 text-amber-500 ml-2" />
                  ניהול מוצרים
                </h1>
                <p className="text-gray-600 text-sm">הוסף, ערוך ומחק מוצרים בחנות</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="elegant-button flex items-center space-x-2 space-x-reverse px-6 py-3 text-base font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>הוסף מוצר</span>
              </button>
            </div>
          </div>
        </div>

        {/* Compact Form */}
        {showForm && (
          <div ref={formRef} className="glass-card p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-900 mb-2 flex items-center">
                {editingProduct ? <Edit2 className="w-5 h-5 text-amber-500 ml-2" /> : <Plus className="w-5 h-5 text-amber-500 ml-2" />}
                {editingProduct ? `עריכת מוצר: ${editingProduct.name}` : 'הוספת מוצר חדש'}
              </h2>
              {editingProduct && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-amber-700 text-sm flex items-center">
                    <Edit2 className="w-4 h-4 ml-2" />
                    עורך כעת את: <strong className="mr-2">{editingProduct.name}</strong>
                  </p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Basic Info Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Diamond className="w-4 h-4 text-amber-500 ml-2" />
                  מידע בסיסי
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם המוצר *
                  </label>
                  <input
                    {...register('name', { required: 'שדה חובה' })}
                    className="input-field"
                    placeholder="הכנס שם מוצר"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מחיר *
                  </label>
                  <input
                    {...register('price', { 
                      required: 'שדה חובה',
                      min: { value: 0, message: 'המחיר חייב להיות חיובי' }
                    })}
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="הכנס מחיר"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
                </div>
              </div>

              {/* Category Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Diamond className="w-4 h-4 text-amber-500 ml-2" />
                  קטגוריה
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    קטגוריה *
                  </label>
                  <select
                    {...register('category_id', { required: 'שדה חובה' })}
                    className="input-field"
                  >
                    <option value="">בחר קטגוריה</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Image className="w-4 h-4 text-amber-500 ml-2" />
                  תמונות המוצר
                </h3>
                <MultiImageUpload
                  value={productImages}
                  onChange={(newImages) => {
                    console.log('Images changed:', newImages);
                    setProductImages(newImages);
                  }}
                  maxFiles={8}
                  productId={editingProduct?.id}
                />
                
                {/* Image Preview for Editing */}
                {editingProduct && productImages.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Image className="w-4 h-4 text-blue-600 ml-2" />
                      תמונות קיימות למוצר
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {productImages.map((image, index) => (
                        <div key={image.id || index} className="relative group">
                          <img
                            src={image.image_url?.startsWith('http') ? image.image_url : `http://localhost:8001${image.image_url || image.url || image}`}
                            alt={`תמונה ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                          {image.is_primary && (
                            <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1 rounded">
                              ראשית
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color Variants Section */}
              {editingProduct && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>מוצר נוכחי:</strong> {editingProduct.name} (ID: {editingProduct.id})
                    </p>
                  </div>
                  <ProductVariantManager
                    productId={editingProduct.id}
                    variants={editingProduct.variants || []}
                    onVariantsChange={(updatedVariants) => {
                      console.log('Variants updated:', updatedVariants); // Debug log
                      setEditingProduct({
                        ...editingProduct,
                        variants: updatedVariants
                      });
                      
                      // Also update the products list to reflect changes
                      setProducts(prevProducts => 
                        prevProducts.map(p => 
                          p.id === editingProduct.id 
                            ? { ...p, variants: updatedVariants }
                            : p
                        )
                      );
                    }}
                  />
                </div>
              )}

              {/* Note about variants */}
              {!editingProduct && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>הערה:</strong> כדי להוסיף גרסאות צבע, יש צורך תחילה לשמור את המוצר ואז לערוך אותו.
                  </p>
                </div>
              )}

              {/* Description Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תיאור המוצר
                </label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="input-field resize-none w-full"
                  placeholder="הכנס תיאור המוצר (אופציונלי)"
                />
              </div>

              {/* Diamond Properties Section */}
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Diamond className="w-4 h-4 text-amber-600 ml-2" />
                  מאפייני היהלום
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      משקל בקראט
                    </label>
                    <input
                      {...register('carat_weight')}
                      type="number"
                      step="0.01"
                      className="input-field"
                      placeholder="0.50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      דרגת צבע
                    </label>
                    <select {...register('color_grade')} className="input-field">
                      <option value="">בחר דרגת צבע</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                      <option value="G">G</option>
                      <option value="H">H</option>
                      <option value="I">I</option>
                      <option value="J">J</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      דרגת בהירות
                    </label>
                    <select {...register('clarity_grade')} className="input-field">
                      <option value="">בחר דרגת בהירות</option>
                      <option value="FL">FL</option>
                      <option value="IF">IF</option>
                      <option value="VVS1">VVS1</option>
                      <option value="VVS2">VVS2</option>
                      <option value="VS1">VS1</option>
                      <option value="VS2">VS2</option>
                      <option value="SI1">SI1</option>
                      <option value="SI2">SI2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      דרגת חיתוך
                    </label>
                    <select {...register('cut_grade')} className="input-field">
                      <option value="">בחר דרגת חיתוך</option>
                      <option value="Excellent">מעולה</option>
                      <option value="Very Good">טוב מאוד</option>
                      <option value="Good">טוב</option>
                      <option value="Fair">בינוני</option>
                      <option value="Poor">גרוע</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      צורה
                    </label>
                    <select {...register('shape')} className="input-field">
                      <option value="">בחר צורה</option>
                      <option value="Round">עגול</option>
                      <option value="Princess">נסיכה</option>
                      <option value="Emerald">אמרלד</option>
                      <option value="Asscher">אשר</option>
                      <option value="Oval">אליפטי</option>
                      <option value="Radiant">קורן</option>
                      <option value="Cushion">כרית</option>
                      <option value="Heart">לב</option>
                      <option value="Pear">אגס</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      מספר תעודה
                    </label>
                    <input
                      {...register('certificate_number')}
                      className="input-field"
                      placeholder="מספר תעודה"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Settings Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Settings className="w-4 h-4 text-blue-600 ml-2" />
                  הגדרות ניהול
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      {...register('is_featured')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="mr-2 block text-sm text-gray-900">
                      מוצר מועדף (יוצג בסקציית המועדפים)
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      הנחה באחוזים
                    </label>
                    <input
                      {...register('discount_percentage')}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="input-field"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      מוצרים עם הנחה יוצגו בסקציית התכשיטים המוזלים
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex space-x-3 space-x-reverse justify-end">
                  <button 
                    type="submit" 
                    className="elegant-button flex items-center space-x-2 space-x-reverse px-6 py-2 text-sm font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'עדכן' : 'צור'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 flex items-center space-x-2 space-x-reverse px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                    <span>ביטול</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Diamond className="w-5 h-5 text-amber-500 ml-2" />
              מוצרים קיימים ({products.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="glass-card p-4 hover:transform hover:scale-105 transition-all duration-300">
                {/* Image Container with fixed height */}
                <div className="mb-3">
                  <ProductImageGallery 
                    images={product.images || product.image_url} 
                    productName={product.name}
                    className="w-full h-40"
                  />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-amber-600">
                      ₪{(product.price || 0).toLocaleString()}
                    </p>
                    {product.discount_percentage > 0 && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                        -{product.discount_percentage}%
                      </span>
                    )}
                  </div>
                  
                  {/* Compact specs */}
                  {(product.carat_weight || (product.color_grade && product.clarity_grade)) && (
                    <div className="text-xs text-gray-600 space-y-1">
                      {product.carat_weight && (
                        <div>משקל: {product.carat_weight} קראט</div>
                      )}
                      {product.color_grade && product.clarity_grade && (
                        <div>דרגה: {product.color_grade} / {product.clarity_grade}</div>
                      )}
                    </div>
                  )}
                  
                  {/* Status Badges */}
                  <div className="flex space-x-1 space-x-reverse flex-wrap gap-1">
                    {product.is_featured && (
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                        ⭐
                      </span>
                    )}
                    {product.discount_percentage > 0 && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        🔥
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Edit button clicked for:', product.name); // Debug log
                      handleEdit(product);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 space-x-reverse bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm py-2 px-3 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>ערוך</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="מחק מוצר"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="glass-card text-center py-16 px-8">
              <div className="text-amber-400 mb-6">
                <Diamond className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">אין מוצרים עדיין</h3>
              <div className="section-divider w-24 mb-6" />
              <p className="text-gray-600 font-light text-lg mb-8">התחל על ידי הוספת המוצר הראשון שלך לחנות היהלומים</p>
              <button
                onClick={() => setShowForm(true)}
                className="elegant-button flex items-center space-x-3 space-x-reverse px-8 py-3 text-lg font-semibold mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>הוסף מוצר ראשון</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts; 