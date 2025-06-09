import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Sparkles, Award, CheckCircle, Phone, Diamond, Droplets, Star, AlertTriangle, Clock, Eye, Settings, Heart } from 'lucide-react';
import PageSEO from '../components/SEO/PageSEO';

const DiamondCareGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
      <PageSEO 
        page="article"
        title="המדריך המקצועי לטיפוח ושמירה על תכשיטי יהלום"
        description="מדריך מקצועי ומפורט לטיפוח תכשיטי יהלום מבית המומחים של LIBI DIAMONDS. שמרו על הברק והיופי לאורך שנים עם טכניקות מקצועיות"
        canonical="https://libi-jewelry.com/diamond-care-guide"
      />

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Heebo:wght@300;400;500;600;700&display=swap');
        
        .luxury-text {
          font-family: 'Frank Ruhl Libre', 'Heebo', serif;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        
        .professional-text {
          font-family: 'Heebo', sans-serif;
          font-weight: 400;
          line-height: 1.7;
          letter-spacing: 0.01em;
        }
        
        .elegant-divider {
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212, 175, 55, 0.3) 20%,
            #d4af37 50%,
            rgba(212, 175, 55, 0.3) 80%,
            transparent 100%
          );
          position: relative;
        }
        
        .elegant-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #d4af37;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.3);
        }
        
        .professional-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.08),
            0 8px 25px rgba(212, 175, 55, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .professional-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #f4e4bc, #d4af37);
        }
        
        .professional-card:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.12),
            0 12px 30px rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.25);
        }
        
        .expertise-badge {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          color: #8b5a00;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        
        .care-step {
          background: white;
          border: 1px solid rgba(212, 175, 55, 0.12);
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.4s ease;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .care-step::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), transparent, rgba(212, 175, 55, 0.3));
          border-radius: 20px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .care-step:hover::before {
          opacity: 1;
        }
        
        .care-step:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }
        
        .step-number {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
          margin: 0 auto 2rem;
          position: relative;
          box-shadow: 0 8px 20px rgba(44, 62, 80, 0.3);
        }
        
        .step-number::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(45deg, #d4af37, #f4e4bc, #d4af37);
          border-radius: 50%;
          z-index: -1;
        }
        
        .care-tip {
          background: linear-gradient(135deg, 
            rgba(34, 197, 94, 0.08) 0%, 
            rgba(74, 222, 128, 0.05) 50%,
            rgba(34, 197, 94, 0.08) 100%
          );
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          backdrop-filter: blur(5px);
          margin: 1.5rem 0;
        }
        
        .care-tip::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #22c55e, #4ade80, #22c55e);
        }
        
        .warning-box {
          background: linear-gradient(135deg, 
            rgba(239, 68, 68, 0.08) 0%, 
            rgba(248, 113, 113, 0.05) 50%,
            rgba(239, 68, 68, 0.08) 100%
          );
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          backdrop-filter: blur(5px);
          margin: 1.5rem 0;
        }
        
        .warning-box::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #ef4444, #f87171, #ef4444);
        }
        
        .professional-icon {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border: 2px solid rgba(212, 175, 55, 0.2);
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          transition: all 0.3s ease;
        }
        
        .care-step:hover .professional-icon {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          border-color: #d4af37;
          transform: scale(1.1);
        }
        
        .care-step:hover .professional-icon svg {
          color: #8b5a00;
        }
        
        .expert-quote {
          background: linear-gradient(135deg, rgba(44, 62, 80, 0.05), rgba(52, 73, 94, 0.02));
          border-right: 4px solid #d4af37;
          border-radius: 12px;
          padding: 2.5rem;
          margin: 2rem 0;
          position: relative;
        }
        
        .expert-quote::before {
          content: '"';
          position: absolute;
          top: -10px;
          right: 20px;
          font-size: 4rem;
          color: rgba(212, 175, 55, 0.3);
          font-family: serif;
        }
        
        .luxury-cta {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .luxury-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.1), transparent);
          z-index: 1;
        }
        
        .luxury-cta > * {
          position: relative;
          z-index: 2;
        }
        
        .premium-button {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          color: #8b5a00;
          border: none;
          padding: 1rem 2rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
        }
        
        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
          background: linear-gradient(135deg, #e6c558, #f4e4bc);
        }
        
        .cleaning-supply {
          background: white;
          border: 1px solid rgba(212, 175, 55, 0.12);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .cleaning-supply:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
          border-color: rgba(212, 175, 55, 0.3);
        }
        
        .service-highlight {
          background: linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(160, 82, 45, 0.05));
          border: 1px solid rgba(139, 69, 19, 0.2);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
        }
        
        .service-highlight::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #8b4513, #a0522d, #8b4513);
        }
        
        .rtl-content {
          direction: rtl;
          text-align: right;
        }
        
        @media (max-width: 768px) {
          .professional-card {
            padding: 2rem;
          }
          
          .care-step {
            padding: 2rem;
          }
          
          .step-number {
            width: 3rem;
            height: 3rem;
            font-size: 1.2rem;
          }
          
          .luxury-cta {
            padding: 2rem;
          }
        }
      `}</style>

      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="expertise-badge inline-block mb-8">
              מדריך מקצועי לטיפוח תכשיטים
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 luxury-text">
              טיפוח ושמירה
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                על תכשיטי יהלום
              </span>
            </h1>
            
            <div className="elegant-divider w-48 mx-auto mb-8" />
            
            <p className="text-xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto professional-text">
              מדריך מקצועי ומפורט מבית המומחים של LIBI DIAMONDS לשמירה על הברק והיופי 
              של תכשיטי היהלום שלכם לאורך שנים רבות עם טכניקות טיפוח מתקדמות.
            </p>
            
            <div className="mt-10">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-gold transition-colors duration-300 professional-text"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                חזרה לדף הבית
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="space-y-16">

            {/* Introduction */}
            <div className="rtl-content">
              <div className="professional-card">
                <h2 className="text-4xl font-light text-gray-900 mb-8 luxury-text">
                  שמירה על השקעתכם לכל החיים
                </h2>
                <div className="space-y-6 text-lg text-gray-700 professional-text">
                  <p>
                    תכשיטי יהלום הם השקעה יקרת ערך שמצריכה טיפוח מקצועי ושמירה נכונה. 
                    עם הטיפוח הנכון, תכשיטי היהלום שלכם ישמרו על הברק המרהיב והיופי 
                    המקורי לאורך דורות רבים.
                  </p>
                  <p>
                    המומחים שלנו ב-LIBI DIAMONDS פיתחו מתודולוגיה מקצועית לטיפוח תכשיטים 
                    המבוססת על שנות ניסיון וטכניקות מתקדמות בתחום תכשיטי היוקרה.
                  </p>
                </div>
                
                <div className="expert-quote mt-8">
                  <p className="text-lg text-gray-800 professional-text">
                    טיפוח נכון של תכשיטי יהלום אינו רק שמירה על היופי החיצוני, אלא גם שמירה 
                    על הערך וההשקעה לאורך זמן.
                  </p>
                  <footer className="mt-4 text-gray-600 font-medium">
                    — צוות מומחי התכשיטים, LIBI DIAMONDS
                  </footer>
                </div>
              </div>
            </div>

            {/* Cleaning Steps */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                תהליך הניקוי המקצועי בארבעה שלבים
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="care-step">
                  <div className="step-number">1</div>
                  <div className="professional-icon">
                    <Droplets className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-xl">הכנת תמיסה</h4>
                  <div className="flex-1">
                    <p className="text-gray-600 professional-text mb-4">
                      ערבו מים פושרים עם כמות קטנה של סבון עדין או נוזל לכלים איכותי
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>• מים בטמפרטורת חדר</p>
                      <p>• סבון לא אגרסיבי</p>
                      <p>• ערבוב עדין</p>
                    </div>
                  </div>
                </div>
                
                <div className="care-step">
                  <div className="step-number">2</div>
                  <div className="professional-icon">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-xl">שטיפה עדינה</h4>
                  <div className="flex-1">
                    <p className="text-gray-600 professional-text mb-4">
                      השתמשו במברשת שיניים רכה לניקוי עדין של התכשיט ואזורי השיבוץ
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>• מברשת שיניים רכה</p>
                      <p>• תנועות עדינות</p>
                      <p>• תשומת לב לפרטים</p>
                    </div>
                  </div>
                </div>
                
                <div className="care-step">
                  <div className="step-number">3</div>
                  <div className="professional-icon">
                    <Sparkles className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-xl">שטיפת מים</h4>
                  <div className="flex-1">
                    <p className="text-gray-600 professional-text mb-4">
                      שטפו היטב במים נקיים להסרת שאריות הסבון והלכלוך
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>• מים זורמים נקיים</p>
                      <p>• הסרת כל שאריות הסבון</p>
                      <p>• בדיקה קפדנית</p>
                    </div>
                  </div>
                </div>
                
                <div className="care-step">
                  <div className="step-number">4</div>
                  <div className="professional-icon">
                    <Star className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-xl">ייבוש מקצועי</h4>
                  <div className="flex-1">
                    <p className="text-gray-600 professional-text mb-4">
                      ייבשו עם מטלית מיקרופייבר רכה לקבלת ברק מושלם
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>• מטלית מיקרופייבר</p>
                      <p>• ייבוש עדין</p>
                      <p>• ברק מושלם</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="care-tip mt-8">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center text-xl">
                  <CheckCircle className="w-6 h-6 ml-2" />
                  המלצה מקצועית
                </h4>
                <p className="text-green-700 professional-text">
                  בצעו תהליך ניקוי זה אחת לשבוע לתכשיטים הנעים בקביעות, 
                  ופעם בחודש לתכשיטים המשמשים בהזדמנויות מיוחדות.
                </p>
              </div>
            </div>

            {/* Cleaning Supplies */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                אביזרי הניקוי המומלצים
              </h3>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="cleaning-supply">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplets className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">מים פושרים</h4>
                  <p className="text-gray-600 text-sm">בטמפרטורת חדר, לא חמים מדי</p>
                </div>
                
                <div className="cleaning-supply">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">סבון עדין</h4>
                  <p className="text-gray-600 text-sm">נוזל כלים איכותי או סבון לתינוקות</p>
                </div>
                
                <div className="cleaning-supply">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">מברשת רכה</h4>
                  <p className="text-gray-600 text-sm">מברשת שיניים רכה או מברשת תכשיטים</p>
                </div>
                
                <div className="cleaning-supply">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">מטלית מיקרופייבר</h4>
                  <p className="text-gray-600 text-sm">לייבוש ולטישה ללא שריטות</p>
                </div>
              </div>
            </div>

            {/* What to Avoid */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                דברים שחשוב להימנע מהם
              </h3>
              
              <div className="warning-box">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center text-xl">
                  <AlertTriangle className="w-6 h-6 ml-2" />
                  אזהרות חשובות
                </h4>
                <div className="space-y-4 text-red-700 professional-text">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 ml-2 mt-1 flex-shrink-0" />
                    <p>אל תשתמשו בחומרי ניקוי חריפים כמו אמוניה או כלור</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 ml-2 mt-1 flex-shrink-0" />
                    <p>הימנעו מחומרי ניקוי אולטרה סוניים ביתיים</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 ml-2 mt-1 flex-shrink-0" />
                    <p>אל תשתמשו במברשות קשות או חומרים שוחקים</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 ml-2 mt-1 flex-shrink-0" />
                    <p>הימנעו מחשיפה למים חמים מדי או קרים מדי</p>
                  </div>
                </div>
              </div>
              
              <div className="care-tip mt-6">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center text-xl">
                  <Shield className="w-6 h-6 ml-2" />
                  שמירה יומיומית
                </h4>
                <p className="text-green-700 professional-text">
                  הסירו תכשיטים לפני רחצה, שחייה, עבודות בית, ספורט או שימוש במוצרי יופי. 
                  הימנעו מחשיפה לכימיקלים, פרפומים וקרמים.
                </p>
              </div>
            </div>

            {/* Professional Service */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                שירות ניקוי מקצועי ב-LIBI DIAMONDS
              </h3>
              
              <div className="service-highlight">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Diamond className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 luxury-text">
                    שירות ניקוי מקצועי מתקדם
                  </h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 ml-2 text-gold" />
                      מה כלול בשירות
                    </h5>
                    <ul className="space-y-2 text-gray-700 professional-text">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        ניקוי אולטרה סוני מקצועי
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        בדיקת שיבוצים ויציבות
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        ליטוש וחידוד מתכת
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                        בדיקה גמולוגית כללית
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 ml-2 text-gold" />
                      מתי להגיע לניקוי מקצועי
                    </h5>
                    <ul className="space-y-2 text-gray-700 professional-text">
                      <li className="flex items-center">
                        <Star className="w-4 h-4 ml-2 text-gold" />
                        פעם בשנה לתכשיטים יומיומיים
                      </li>
                      <li className="flex items-center">
                        <Star className="w-4 h-4 ml-2 text-gold" />
                        לפני אירועים חשובים
                      </li>
                      <li className="flex items-center">
                        <Star className="w-4 h-4 ml-2 text-gold" />
                        כאשר הברק מתעמעם
                      </li>
                      <li className="flex items-center">
                        <Star className="w-4 h-4 ml-2 text-gold" />
                        אחרי חשיפה לכימיקלים
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional CTA */}
            <div className="luxury-cta">
              <h3 className="text-3xl font-light mb-6 luxury-text">
                זקוקים לשירות ניקוי מקצועי?
              </h3>
              <p className="text-xl mb-8 opacity-90 professional-text">
                הצוות המקצועי שלנו ב-LIBI DIAMONDS עומד לרשותכם לשירות ניקוי מתקדם ובדיקה מקצועית 
                של תכשיטי היהלום שלכם. שמרו על ההשקעה שלכם עם הטיפוח הטוב ביותר.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/contact" 
                  className="premium-button inline-flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 ml-2" />
                  קביעת תור לניקוי
                </Link>
                <Link 
                  to="/services" 
                  className="premium-button inline-flex items-center justify-center"
                >
                  <Eye className="w-5 h-5 ml-2" />
                  כל השירותים שלנו
                </Link>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg opacity-75 professional-text">
                  שירות מקצועי ואמין | ציוד מתקדם | אחריות מלאה על העבודה
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default DiamondCareGuide; 