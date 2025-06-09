import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import { CreditCard, ArrowRight, Shield, Check, Phone, Mail } from 'lucide-react';

const Checkout = () => {
  const { items, cartTotal, totalItems, emptyCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically process the payment
    alert('תודה על הרכישה! ההזמנה שלכם התקבלה בהצלחה.');
    emptyCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 py-24" dir="rtl">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="glass-card p-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-light text-gray-800 mb-4">הסל ריק</h1>
            <p className="text-gray-600 mb-8">אין פריטים בסל הקניות שלכם</p>
            <Link to="/products" className="elegant-button px-8 py-3">
              חזור לקנייה
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 py-24" dir="rtl">
      <style jsx="true">{`
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(212, 175, 55, 0.1);
          border-radius: 32px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .elegant-button {
          background: linear-gradient(135deg, #d4af37, #f4e4bc, #d4af37);
          border: 2px solid rgba(212, 175, 55, 0.4);
          color: #8b5a00;
          font-weight: 600;
          letter-spacing: 0.8px;
          transition: all 0.4s ease;
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          padding: 16px 24px;
        }
        
        .elegant-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.6);
          background: linear-gradient(135deg, #e6c558, #f4e4bc, #e6c558);
          border-color: rgba(212, 175, 55, 0.6);
        }
        
        .elegant-input {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
          padding: 12px 16px;
          width: 100%;
        }
        
        .elegant-input:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
          outline: none;
        }
        
        .text-gold {
          color: #d4af37;
        }
        
        .section-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #d4af37 20%,
            #d4af37 80%,
            transparent 100%
          );
          margin: 0 auto;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
            השלמת הרכישה
          </h1>
          <div className="section-divider w-32 mb-6" />
          <p className="text-xl text-gray-700 font-light">
            עוד צעד אחד לקבלת התכשיטים המושלמים שלכם
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-8">
              <h2 className="text-2xl font-light text-gray-800 mb-6">סיכום הזמנה</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-gray-600 text-sm">כמות: {item.quantity}</p>
                      <p className="text-gold font-semibold">₪{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">סה"כ פריטים:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">משלוח:</span>
                  <span className="font-medium text-green-600">חינם</span>
                </div>
                <div className="flex justify-between items-center text-xl font-semibold">
                  <span>סה"כ לתשלום:</span>
                  <span className="text-gold">₪{cartTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-2xl">
                <div className="flex items-center gap-2 text-green-700">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">תשלום מאובטח</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  הפרטים שלכם מוגנים בהצפנה מתקדמת
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-light text-gray-800 mb-6">פרטים אישיים</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם פרטי</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם משפחה</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-light text-gray-800 mb-6">כתובת משלוח</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">עיר</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">מיקוד</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-light text-gray-800 mb-6">פרטי תשלום</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">מספר כרטיס אשראי</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="elegant-input"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">תאריך תפוגה</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="elegant-input"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="elegant-input"
                      placeholder="123"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם בעל הכרטיס</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="elegant-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="elegant-button flex-1 text-lg"
                >
                  <CreditCard className="w-5 h-5 ml-2" />
                  השלם רכישה - ₪{cartTotal.toLocaleString()}
                </button>
                
                <Link
                  to="/products"
                  className="elegant-button bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  חזור לקנייה
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 