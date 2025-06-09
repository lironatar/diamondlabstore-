import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Image, Save, X, Tag, Settings } from 'lucide-react';
import CategoryImageUpload from '../../components/CategoryImageUpload';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const formRef = useRef(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('שגיאה בטעינת הקטגוריות');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Submitting category data:', data);
      console.log('Editing category:', editingCategory);
      console.log('Category image URL:', categoryImageUrl);
      
      // Prepare category data
      const categoryData = {
        name: data.name,
        description: data.description || '',
        is_active: data.is_active !== false,
        image_url: categoryImageUrl || null
      };

      console.log('Processed category data:', categoryData);

      if (editingCategory) {
        console.log(`Updating category with ID: ${editingCategory.id}`);
        await axios.put(`/categories/${editingCategory.id}`, categoryData);
        toast.success('הקטגוריה עודכנה בהצלחה');
      } else {
        console.log('Creating new category');
        await axios.post('/categories', categoryData);
        toast.success('הקטגוריה נוצרה בהצלחה');
      }
      
      // Reset form and close
      reset();
      setShowForm(false);
      setEditingCategory(null);
      setCategoryImageUrl('');
      fetchCategories();
    } catch (error) {
      console.error('Error in onSubmit:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      toast.error(editingCategory ? `שגיאה בעדכון הקטגוריה: ${errorMessage}` : `שגיאה ביצירת הקטגוריה: ${errorMessage}`);
    }
  };

  const handleEdit = (category) => {
    console.log('Edit clicked for category:', category);
    try {
      setEditingCategory(category);
      setValue('name', category.name);
      setValue('description', category.description || '');
      setValue('is_active', category.is_active !== false);
      
      // Set image URL for the component
      setCategoryImageUrl(category.image_url || '');
      
      setShowForm(true);
      
      // Auto-scroll to form
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
      
      toast.success(`עורך את הקטגוריה: ${category.name}`);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      toast.error('שגיאה בפתיחת טופס עריכה');
    }
  };

  const handleDelete = async (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    const categoryName = category?.name || 'הקטגוריה';
    
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את קטגוריית "${categoryName}"?\nפעולה זו אינה ניתנת לביטול.`)) return;

    try {
      console.log(`Deleting category with ID: ${categoryId}`);
      await axios.delete(`/categories/${categoryId}`);
      toast.success(`הקטגוריה "${categoryName}" נמחקה בהצלחה`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.detail || error.message;
      toast.error(`שגיאה במחיקת הקטגוריה "${categoryName}": ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setEditingCategory(null);
    setCategoryImageUrl('');
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
            <Tag className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-light">טוען קטגוריות...</p>
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
        {/* Header */}
        <div className="glass-card mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-medium text-gray-900 mb-1 flex items-center">
                  <Tag className="w-6 h-6 text-amber-500 ml-2" />
                  ניהול קטגוריות
                </h1>
                <p className="text-gray-600 text-sm">הוסף, ערוך ומחק קטגוריות בחנות</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="elegant-button flex items-center space-x-2 space-x-reverse px-6 py-3 text-base font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>הוסף קטגוריה</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div ref={formRef} className="glass-card p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-900 mb-2 flex items-center">
                {editingCategory ? <Edit2 className="w-5 h-5 text-amber-500 ml-2" /> : <Plus className="w-5 h-5 text-amber-500 ml-2" />}
                {editingCategory ? `עריכת קטגוריה: ${editingCategory.name}` : 'הוספת קטגוריה חדשה'}
              </h2>
              {editingCategory && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-amber-700 text-sm flex items-center">
                    <Edit2 className="w-4 h-4 ml-2" />
                    עורך כעת את: <strong className="mr-2">{editingCategory.name}</strong>
                  </p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Basic Info Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Tag className="w-4 h-4 text-amber-500 ml-2" />
                  מידע בסיסי
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שם הקטגוריה *
                    </label>
                    <input
                      {...register('name', { required: 'שדה חובה' })}
                      className="input-field w-full"
                      placeholder="הכנס שם קטגוריה"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      {...register('is_active')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="mr-2 block text-sm text-gray-900">
                      קטגוריה פעילה (תוצג באתר)
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    תיאור הקטגוריה
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input-field resize-none w-full"
                    placeholder="הכנס תיאור הקטגוריה (אופציונלי)"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Image className="w-4 h-4 text-amber-500 ml-2" />
                  תמונת הקטגוריה
                </h3>
                
                <CategoryImageUpload
                  value={categoryImageUrl}
                  onChange={setCategoryImageUrl}
                  className="mb-4"
                />
                
                <p className="text-xs text-gray-500 mt-2">
                  תמונת הקטגוריה תוצג בדף הבית ובעמוד המוצרים כרקע לקטגוריה
                </p>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex space-x-3 space-x-reverse justify-end">
                  <button 
                    type="submit" 
                    className="elegant-button flex items-center space-x-2 space-x-reverse px-6 py-2 text-sm font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingCategory ? 'עדכן' : 'צור'}</span>
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

        {/* Categories Grid */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Tag className="w-5 h-5 text-amber-500 ml-2" />
              קטגוריות קיימות ({categories.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="glass-card p-4 hover:transform hover:scale-105 transition-all duration-300">
                {/* Category Image */}
                <div className="mb-3">
                  {category.image_url ? (
                    <img
                      src={category.image_url.startsWith('http') ? category.image_url : `http://localhost:8001${category.image_url}`}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg"
                    style={{ display: category.image_url ? 'none' : 'flex' }}
                  >
                    <Tag className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="space-y-2 mb-4">
                  {/* Status Badge */}
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      category.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {category.is_active ? 'פעילה' : 'לא פעילה'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center space-x-1 space-x-reverse bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm py-2 px-3 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>ערוך</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="מחק קטגוריה"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="glass-card text-center py-16 px-8">
              <div className="text-amber-400 mb-6">
                <Tag className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-4">אין קטגוריות עדיין</h3>
              <div className="section-divider w-24 mb-6" />
              <p className="text-gray-600 font-light text-lg mb-8">התחל על ידי הוספת הקטגוריה הראשונה שלך</p>
              <button
                onClick={() => setShowForm(true)}
                className="elegant-button flex items-center space-x-3 space-x-reverse px-8 py-3 text-lg font-semibold mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>הוסף קטגוריה ראשונה</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories; 