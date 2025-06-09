import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Leaf, Award, TrendingUp, CheckCircle, Phone, Diamond, Microscope, Zap, Star, Users, Eye, Settings, Globe, Heart } from 'lucide-react';
import PageSEO from '../components/SEO/PageSEO';

const LabDiamondsArticle = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
      <PageSEO 
        page="article"
        title="יהלומי מעבדה: המדריך המקצועי המלא"
        description="מדריך מקצועי ומקיף על יהלומי מעבדה מבית המומחים של LIBI DIAMONDS. כל מה שצריך לדעת על הטכנולוגיה המתקדמת, איכות ויתרונות יהלומי המעבדה"
        canonical="https://libi-jewelry.com/lab-diamonds-guide"
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
        
        .technology-feature {
          background: white;
          border: 1px solid rgba(212, 175, 55, 0.12);
          border-radius: 16px;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .technology-feature::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), transparent, rgba(212, 175, 55, 0.2));
          border-radius: 16px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .technology-feature:hover::before {
          opacity: 1;
        }
        
        .technology-feature:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }
        
        .professional-icon {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border: 2px solid rgba(212, 175, 55, 0.2);
          width: 4.5rem;
          height: 4.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          transition: all 0.3s ease;
        }
        
        .technology-feature:hover .professional-icon {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          border-color: #d4af37;
          transform: scale(1.1);
        }
        
        .technology-feature:hover .professional-icon svg {
          color: #8b5a00;
        }
        
        .comparison-table {
          background: white;
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
        }
        
        .table-header {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          padding: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
        
        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          transition: all 0.3s ease;
        }
        
        .table-row:hover {
          background: rgba(212, 175, 55, 0.05);
        }
        
        .table-cell {
          padding: 1.5rem;
          text-align: center;
          border-left: 1px solid rgba(212, 175, 55, 0.1);
        }
        
        .table-cell:first-child {
          border-left: none;
          font-weight: 600;
          background: rgba(212, 175, 55, 0.03);
        }
        
        .advantage-card {
          background: linear-gradient(135deg, 
            rgba(212, 175, 55, 0.08) 0%, 
            rgba(244, 228, 188, 0.05) 50%,
            rgba(212, 175, 55, 0.08) 100%
          );
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        
        .advantage-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #d4af37, #f4e4bc, #d4af37);
        }
        
        .advantage-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(212, 175, 55, 0.15);
        }
        
        .expert-insight {
          background: linear-gradient(135deg, rgba(44, 62, 80, 0.05), rgba(52, 73, 94, 0.02));
          border-right: 4px solid #d4af37;
          border-radius: 12px;
          padding: 2.5rem;
          margin: 2rem 0;
          position: relative;
        }
        
        .expert-insight::before {
          content: '"';
          position: absolute;
          top: -10px;
          right: 20px;
          font-size: 4rem;
          color: rgba(212, 175, 55, 0.3);
          font-family: serif;
        }
        
        .certification-badge {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
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
        
        .scientific-highlight {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.05));
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
        }
        
        .scientific-highlight::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #93c5fd, #3b82f6);
        }
        
        .rtl-content {
          direction: rtl;
          text-align: right;
        }
        
        @media (max-width: 768px) {
          .professional-card {
            padding: 2rem;
          }
          
          .table-row {
            grid-template-columns: 1fr;
          }
          
          .table-cell {
            border-left: none;
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          }
          
          .table-cell:first-child {
            background: rgba(212, 175, 55, 0.08);
            font-size: 1.1rem;
          }
          
          .luxury-cta {
            padding: 2rem;
          }
          
          .technology-feature {
            padding: 2rem;
          }
        }
      `}</style>

      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="expertise-badge inline-block mb-8">
              דוח מקצועי מבית המומחים
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 luxury-text">
              יהלומי מעבדה
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                המדריך המקצועי המלא
              </span>
            </h1>
            
            <div className="elegant-divider w-48 mx-auto mb-8" />
            
            <p className="text-xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto professional-text">
              מדריך מקצועי ומקיף על טכנולוגיית יהלומי המעבדה מבית המומחים של LIBI DIAMONDS. 
              הבנה מעמיקה של התהליכים המדעיים, איכות מעולה וייתרונות משמעותיים של עתיד התכשיטים.
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
                  מהפכה טכנולוגית בעולם היהלומים
                </h2>
                <div className="space-y-6 text-lg text-gray-700 professional-text">
                  <p>
                    יהלומי מעבדה מייצגים את שיא הטכנולוגיה המדעית בתחום היהלומים. באמצעות תהליכים 
                    מתקדמים המדמים את התנאים הטבעיים בהם נוצרים יהלומים בכדור הארץ, המדע המודרני 
                    מצליח ליצור יהלומים איכותיים בעלי תכונות זהות לחלוטין ליהלומים טבעיים.
                  </p>
                  <p>
                    המומחים שלנו ב-LIBI DIAMONDS עוקבים אחר ההתפתחויות המתקדמות ביותר בתחום, 
                    ומביאים לכם את איכות היהלומים הגבוהה ביותר עם יתרונות משמעותיים בתחומי האיכות, 
                    הסביבה והערך הכלכלי.
                  </p>
                </div>
                
                <div className="expert-insight mt-8">
                  <p className="text-lg text-gray-800 professional-text">
                    הטכנולוגיה של יהלומי מעבדה הגיעה לרמה של מושלמות כזו, שגם מומחים גמולוגיים 
                    מנוסים זקוקים לציוד מתקדם כדי להבדיל בין יהלום מעבדה ליהלום טבעי.
                  </p>
                  <footer className="mt-4 text-gray-600 font-medium">
                    — צוות המומחים הגמולוגיים, LIBI DIAMONDS
                  </footer>
                </div>
              </div>
            </div>

            {/* Scientific Process */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                התהליך המדעי: טכנולוגיה מתקדמת
              </h3>
              
              <div className="scientific-highlight mb-8">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center text-xl">
                  <Microscope className="w-6 h-6 ml-2" />
                  שתי שיטות מדעיות מובילות
                </h4>
                <p className="text-blue-700 professional-text">
                  יהלומי מעבדה נוצרים באמצעות שתי שיטות מדעיות מתקדמות הפועלות בסביבה מבוקרת 
                  ומדויקת, המדמות את התנאים הקיצוניים בהם נוצרים יהלומים בטבע.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="technology-feature">
                  <div className="professional-icon">
                    <Zap className="w-7 h-7 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-xl">שיטת HPHT</h4>
                  <p className="text-gray-600 professional-text mb-4">
                    <strong>לחץ גבוה וטמפרטורה גבוהה</strong> - מדמה את התנאים בעומק כדור הארץ
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 professional-text">
                    <p>• טמפרטורה: 1,500°C</p>
                    <p>• לחץ: 5 GPa</p>
                    <p>• זמן: מספר שבועות</p>
                  </div>
                </div>
                
                <div className="technology-feature">
                  <div className="professional-icon">
                    <Settings className="w-7 h-7 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-xl">שיטת CVD</h4>
                  <p className="text-gray-600 professional-text mb-4">
                    <strong>שיקוע אדי כימי</strong> - בנייה שכבה אחר שכבה בדיוק מיקרומטרי
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 professional-text">
                    <p>• טמפרטורה: 800°C</p>
                    <p>• סביבת ואקום מלא</p>
                    <p>• דיוק: ברמה האטומית</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                השוואה מקצועית: יהלומי מעבדה מול יהלומים טבעיים
              </h3>
              
              <div className="comparison-table">
                <div className="table-header">
                  <div className="table-row">
                    <div className="table-cell">קריטריון</div>
                    <div className="table-cell">יהלומי מעבדה</div>
                    <div className="table-cell">יהלומים טבעיים</div>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">הרכב כימי</div>
                  <div className="table-cell">
                    <span className="certification-badge">
                      <CheckCircle className="w-4 h-4" />
                      פחמן טהור 100%
                    </span>
                  </div>
                  <div className="table-cell">פחמן טהור 100%</div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">קשיות (סולם מוהס)</div>
                  <div className="table-cell">
                    <span className="certification-badge">
                      <Award className="w-4 h-4" />
                      10/10
                    </span>
                  </div>
                  <div className="table-cell">10/10</div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">זמן היווצרות</div>
                  <div className="table-cell">
                    <span className="text-green-600 font-semibold">שבועות מספר</span>
                  </div>
                  <div className="table-cell">מיליארדי שנים</div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">טוהר</div>
                  <div className="table-cell">
                    <span className="certification-badge">
                      <Star className="w-4 h-4" />
                      גבוה יותר
                    </span>
                  </div>
                  <div className="table-cell">משתנה</div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">מחיר</div>
                  <div className="table-cell">
                    <span className="text-green-600 font-semibold">40-60% פחות</span>
                  </div>
                  <div className="table-cell">גבוה משמעותית</div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell">השפעה סביבתית</div>
                  <div className="table-cell">
                    <span className="certification-badge">
                      <Leaf className="w-4 h-4" />
                      ידידותית לסביבה
                    </span>
                  </div>
                  <div className="table-cell">כריית עומק</div>
                </div>
              </div>
            </div>

            {/* Advantages */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                יתרונות מהותיים של יהלומי מעבדה
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="advantage-card">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                    <TrendingUp className="w-6 h-6 ml-2 text-gold" />
                    ערך כלכלי מעולה
                  </h4>
                  <p className="text-gray-700 professional-text">
                    השקעה חכמה המאפשרת רכישת יהלום באיכות גבוהה יותר באותו תקציב, 
                    או חיסכון משמעותי באותה איכות.
                  </p>
                </div>
                
                <div className="advantage-card">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                    <Shield className="w-6 h-6 ml-2 text-gold" />
                    איכות מובטחת
                  </h4>
                  <p className="text-gray-700 professional-text">
                    תהליך ייצור מבוקר המבטיח איכות עקבית וגבוהה, 
                    ללא התלות בגורמים טבעיים אקראיים.
                  </p>
                </div>
                
                <div className="advantage-card">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                    <Leaf className="w-6 h-6 ml-2 text-gold" />
                    אחריות סביבתית
                  </h4>
                  <p className="text-gray-700 professional-text">
                    בחירה אתית המתאימה לדור הצעיר המודע לסביבה, 
                    ללא פגיעה בנופים או בקהילות מקומיות.
                  </p>
                </div>
                
                <div className="advantage-card">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                    <Eye className="w-6 h-6 ml-2 text-gold" />
                    שקיפות מלאה
                  </h4>
                  <p className="text-gray-700 professional-text">
                    ידיעה מדויקת של מקור היהלום ותהליך היצורו, 
                    עם תעודות איכות מפורטות וחד-משמעיות.
                  </p>
                </div>
              </div>
            </div>

            {/* Market Trends */}
            <div className="professional-card rtl-content">
              <h3 className="text-3xl font-medium text-gray-900 mb-8 luxury-text">
                מגמות שוק ואימוץ בתעשייה
              </h3>
              
              <div className="space-y-6 text-lg text-gray-700 professional-text">
                <p>
                  השוק העולמי של יהלומי מעבדה חווה צמיחה משמעותית, עם אימוץ הולך וגובר 
                  מצד מותגי יוקרה מובילים ובתי תכשיטים מוכרים ברחבי העולם.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="technology-feature">
                    <div className="professional-icon">
                      <TrendingUp className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3">צמיחת שוק</h4>
                    <p className="text-3xl font-bold text-gold mb-2">20%</p>
                    <p className="text-gray-600 text-sm">גידול שנתי ממוצע</p>
                  </div>
                  
                  <div className="technology-feature">
                    <div className="professional-icon">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3">העדפת צרכנים</h4>
                    <p className="text-3xl font-bold text-gold mb-2">70%</p>
                    <p className="text-gray-600 text-sm">מהצעירים מעדיפים</p>
                  </div>
                  
                  <div className="technology-feature">
                    <div className="professional-icon">
                      <Globe className="w-6 h-6 text-gray-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3">אימוץ עולמי</h4>
                    <p className="text-3xl font-bold text-gold mb-2">85%</p>
                    <p className="text-gray-600 text-sm">מהמותגים המובילים</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Consultation CTA */}
            <div className="luxury-cta">
              <h3 className="text-3xl font-light mb-6 luxury-text">
                מעוניינים בייעוץ מקצועי על יהלומי מעבדה?
              </h3>
              <p className="text-xl mb-8 opacity-90 professional-text">
                המומחים הגמולוגיים שלנו ב-LIBI DIAMONDS עומדים לרשותכם לייעוץ מקצועי ואישי. 
                נעזור לכם להבין את כל היתרונות ולבחור את היהלום המושלם עבורכם.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/contact" 
                  className="premium-button inline-flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 ml-2" />
                  יצירת קשר עם המומחים
                </Link>
                <Link 
                  to="/products" 
                  className="premium-button inline-flex items-center justify-center"
                >
                  <Diamond className="w-5 h-5 ml-2" />
                  צפייה ביהלומי מעבדה
                </Link>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg opacity-75 professional-text">
                  ייעוץ גמולוגי מקצועי | תעודות איכות בינלאומיות | שירות מקצועי ואישי
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default LabDiamondsArticle; 