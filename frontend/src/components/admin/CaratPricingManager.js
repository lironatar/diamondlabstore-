import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, Gem, DollarSign, Settings } from 'lucide-react';

const CaratPricingManager = () => {
  const [caratPricing, setCaratPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    carat_weight: '',
    price_multiplier: '',
    is_active: true
  });

  useEffect(() => {
    fetchCaratPricing();
  }, []);

  const fetchCaratPricing = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/api/carat-pricing', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCaratPricing(response.data);
    } catch (error) {
      console.error('Error fetching carat pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      
      if (editingId) {
        // Update existing
        await axios.put(`/api/carat-pricing/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new
        await axios.post('/api/carat-pricing', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      await fetchCaratPricing();
      resetForm();
    } catch (error) {
      console.error('Error saving carat pricing:', error);
      alert('שגיאה בשמירת התמחור');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמחור זה?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`/api/carat-pricing/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCaratPricing();
    } catch (error) {
      console.error('Error deleting carat pricing:', error);
      alert('שגיאה במחיקת התמחור');
    }
  };

  const startEditing = (pricing) => {
    setEditingId(pricing.id);
    setFormData({
      carat_weight: pricing.carat_weight,
      price_multiplier: pricing.price_multiplier,
      is_active: pricing.is_active
    });
    setAddingNew(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({
      carat_weight: '',
      price_multiplier: '',
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Gem className="w-12 h-12 text-gold animate-pulse mx-auto mb-4" />
          <p>טוען תמחור קראטים...</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-gold" />
          <h2 className="text-2xl font-bold text-gray-900">ניהול תמחור קראטים</h2>
        </div>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          הוספת תמחור חדש
        </button>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">איך עובד תמחור קראטים?</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              כל משקל קראט יש לו מכפיל מחיר. המחיר הסופי של המוצר מחושב על ידי: 
              <span className="font-mono bg-blue-100 px-1 rounded">מחיר בסיס × מכפיל קראט × (1 - הנחה%)</span>
              <br />
              <strong>דוגמה:</strong> מוצר במחיר בסיס ₪1,000, קראט 1.5 עם מכפיל 1.45 = ₪1,450
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(addingNew || editingId) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'עריכת תמחור קראט' : 'הוספת תמחור קראט חדש'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  משקל קראט
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={formData.carat_weight}
                  onChange={(e) => setFormData({ ...formData, carat_weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-1 focus:ring-gold"
                  placeholder="1.0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מכפיל מחיר
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="10"
                  value={formData.price_multiplier}
                  onChange={(e) => setFormData({ ...formData, price_multiplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-gold focus:ring-1 focus:ring-gold"
                  placeholder="1.0"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <span className="mr-2 text-sm text-gray-700">פעיל</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                שמור
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pricing Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">תמחור קראטים קיים</h3>
        </div>
        
        {caratPricing.length === 0 ? (
          <div className="p-8 text-center">
            <Gem className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">לא הוגדרו תמחורי קראטים עדיין</p>
            <button
              onClick={() => setAddingNew(true)}
              className="mt-4 text-gold hover:text-yellow-600 font-medium"
            >
              הוסף תמחור ראשון
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    משקל קראט
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    מכפיל מחיר
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    דוגמה (₪1,000 בסיס)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {caratPricing.map((pricing) => (
                  <tr key={pricing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Gem className="w-4 h-4 text-gold ml-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {pricing.carat_weight} קראט
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ×{pricing.price_multiplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₪{(1000 * pricing.price_multiplier).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pricing.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pricing.is_active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(pricing)}
                          className="text-blue-600 hover:text-blue-900"
                          title="ערוך"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pricing.id)}
                          className="text-red-600 hover:text-red-900"
                          title="מחק"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaratPricingManager; 