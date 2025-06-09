import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Edit, Trash2, Gem, DollarSign, Calculator } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCaratPricing = () => {
  const [caratPricings, setCaratPricings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCarat, setEditingCarat] = useState(null);
  const [formData, setFormData] = useState({
    carat_weight: '',
    price_multiplier: '',
    display_name: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCaratPricings();
  }, []);

  const fetchCaratPricings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/carat-pricing');
      setCaratPricings(response.data);
    } catch (error) {
      console.error('Error fetching carat pricings:', error);
      toast.error('שגיאה בטעינת תמחור הקראטים');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCarat) {
        await axios.put(`/carat-pricing/${editingCarat.id}`, formData);
        toast.success('תמחור קראט עודכן בהצלחה');
      } else {
        await axios.post('/carat-pricing', formData);
        toast.success('תמחור קראט נוסף בהצלחה');
      }
      
      setShowForm(false);
      setEditingCarat(null);
      setFormData({ carat_weight: '', price_multiplier: '', display_name: '' });
      fetchCaratPricings();
    } catch (error) {
      console.error('Error saving carat pricing:', error);
      toast.error('שגיאה בשמירת תמחור הקראט');
    }
  };

  const handleEdit = (carat) => {
    setEditingCarat(carat);
    setFormData({
      carat_weight: carat.carat_weight.toString(),
      price_multiplier: carat.price_multiplier.toString(),
      display_name: carat.display_name || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תמחור קראט זה?')) {
      try {
        await axios.delete(`/carat-pricing/${id}`);
        toast.success('תמחור קראט נמחק בהצלחה');
        fetchCaratPricings();
      } catch (error) {
        console.error('Error deleting carat pricing:', error);
        toast.error('שגיאה במחיקת תמחור הקראט');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCarat(null);
    setFormData({ carat_weight: '', price_multiplier: '', display_name: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">טוען תמחור קראטים...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ניהול תמחור קראטים</h1>
              <p className="text-gray-600">הגדר מכפילי מחיר עבור גדלי קראטים שונים</p>
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

        {/* Action Buttons */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 ml-2" />
            הוסף תמחור קראט חדש
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">
                {editingCarat ? 'עריכת תמחור קראט' : 'הוספת תמחור קראט חדש'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    משקל קראט
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.carat_weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, carat_weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
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
                    value={formData.price_multiplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_multiplier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם תצוגה (אופציונלי)
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="למשל: קראט אחד"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gold text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                  >
                    {editingCarat ? 'עדכן' : 'הוסף'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pricing Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">תמחור קראטים קיים</h2>
          </div>
          
          {caratPricings.length > 0 ? (
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
                      שם תצוגה
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      דוגמה (מחיר בסיס ₪10,000)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {caratPricings.map((carat) => (
                    <tr key={carat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Gem className="w-5 h-5 text-gold ml-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {carat.carat_weight} קראט
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">×{carat.price_multiplier}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {carat.display_name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calculator className="w-4 h-4 text-gray-400 ml-1" />
                          <span className="text-sm font-medium text-green-600">
                            ₪{(10000 * carat.price_multiplier).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(carat)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(carat.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
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
          ) : (
            <div className="text-center py-12">
              <Gem className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">אין תמחור קראטים</h3>
              <p className="text-gray-500 mb-4">התחל על ידי הוספת תמחור קראט ראשון</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gold text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 inline-flex items-center"
              >
                <Plus className="w-5 h-5 ml-2" />
                הוסף תמחור קראט
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <DollarSign className="w-6 h-6 text-blue-600 ml-3 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">איך עובד תמחור הקראטים?</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• מחיר סופי = מחיר בסיס × מכפיל קראט × (1 - אחוז הנחה)</li>
                <li>• מכפיל גבוה יותר = מחיר גבוה יותר לקראט זה</li>
                <li>• קראטים גדולים יותר בדרך כלל דורשים מכפיל גבוה יותר</li>
                <li>• שם התצוגה יופיע ללקוחות במקום המספר הטכני</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCaratPricing; 