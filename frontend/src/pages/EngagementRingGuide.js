import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Sparkles, Award, CheckCircle, Phone, Diamond, Gem, Eye, Star, Users, Crown, TrendingUp } from 'lucide-react';
import PageSEO from '../components/SEO/PageSEO';

const EngagementRingGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
      <PageSEO 
        page="article"
        title="המדריך המקצועי לבחירת טבעת אירוסין מושלמת"
        description="מדריך מקצועי ומקיף לבחירת טבעת האירוסין המושלמת. כל מה שצריך לדעת על יהלומים, עיצובים ובחירה נכונה מבית המומחים של LIBI DIAMONDS"
        canonical="https://libi-jewelry.com/engagement-ring-guide"
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
        
        .step-indicator {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.5rem;
          margin-left: 2rem;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(44, 62, 80, 0.3);
          position: relative;
        }
        
        .step-indicator::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(45deg, #d4af37, #f4e4bc, #d4af37);
          border-radius: 50%;
          z-index: -1;
        }
        
        .luxury-highlight {
          background: linear-gradient(135deg, 
            rgba(212, 175, 55, 0.1) 0%, 
            rgba(244, 228, 188, 0.08) 50%,
            rgba(212, 175, 55, 0.1) 100%
          );
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 2.5rem;
          position: relative;
          backdrop-filter: blur(5px);
        }
        
        .luxury-highlight::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #d4af37, #f4e4bc, #d4af37);
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
        
        .diamond-feature {
          background: white;
          border: 1px solid rgba(212, 175, 55, 0.12);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .diamond-feature::before {
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
        
        .diamond-feature:hover::before {
          opacity: 1;
        }
        
        .diamond-feature:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
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
        
        .diamond-feature:hover .professional-icon {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          border-color: #d4af37;
          transform: scale(1.1);
        }
        
        .diamond-feature:hover .professional-icon svg {
          color: #8b5a00;
        }
        
        .professional-list {
          list-style: none;
          padding: 0;
        }
        
        .professional-list-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.1);
          transition: all 0.3s ease;
        }
        
        .professional-list-item:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(212, 175, 55, 0.2);
          transform: translateX(-4px);
        }
        
        .professional-list-item .icon {
          margin-left: 1rem;
          margin-right: 0;
          flex-shrink: 0;
          margin-top: 0.25rem;
          color: #d4af37;
        }
        
        .expert-quote {
          background: linear-gradient(135deg, rgba(44, 62, 80, 0.05), rgba(52, 73, 94, 0.02));
          border-right: 4px solid #d4af37;
          border-radius: 12px;
          padding: 2rem;
          margin: 2rem 0;
          font-style: italic;
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
        
        .rtl-content {
          direction: rtl;
          text-align: right;
        }
        
        .step-content {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .professional-card {
            padding: 2rem;
          }
          
          .step-indicator {
            width: 3rem;
            height: 3rem;
            font-size: 1.2rem;
            margin-left: 1rem;
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
              מדריך מקצועי מבית המומחים
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 luxury-text">
              המדריך המקצועי
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                לבחירת טבעת אירוסין מושלמת
              </span>
            </h1>
            
            <div className="elegant-divider w-48 mx-auto mb-8" />
            
            <p className="text-xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto professional-text">
              מדריך מקצועי ומקיף מבית המומחים של LIBI DIAMONDS. כל מה שצריך לדעת על בחירת טבעת האירוסין המושלמת, 
              מאיכות היהלומים ועד לעיצוב הסופי שיחווה איתכם לכל החיים.
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
                  בחירת טבעת האירוסין: השקעה לכל החיים
                </h2>
                <div className="space-y-6 text-lg text-gray-700 professional-text">
                  <p>
                    טבעת האירוסין היא לא רק תכשיט - היא סמל של אהבה, מחויבות ותחילה של פרק חדש בחיים. 
                    בחירת הטבעת המושלמת דורשת הבנה מעמיקה של איכות היהלומים, סוגי השיבוצים והסגנונות השונים.
                  </p>
                  <p>
                    כמומחים בתחום היהלומים ותכשיטי יוקרה, אנו מביאים לכם מדריך מקצועי ומקיף שיעזור לכם לקבל החלטה מושכלת 
                    ולבחור טבעת שתעמוד במבחן הזמן - הן מבחינת איכות והן מבחינת סגנון.
                  </p>
                </div>
                
                <div className="expert-quote mt-8">
                  <p className="text-lg text-gray-800 professional-text">
                    הבחירה בטבעת אירוסין היא אמנות שמשלבת מקצועיות, ניסיון ורגש. כל זוג ייחודי, וכך גם הטבעת שלו.
                  </p>
                  <footer className="mt-4 text-gray-600 font-medium">
                    — צוות המומחים, LIBI DIAMONDS
                  </footer>
                </div>
              </div>
            </div>

            {/* Step 1 - Understanding Style */}
            <div className="professional-card rtl-content">
              <div className="flex items-start">
                <div className="step-indicator">1</div>
                <div className="step-content">
                  <h3 className="text-3xl font-medium text-gray-900 mb-6 luxury-text">
                    הבנת הסגנון האישי והעדפות עיצוב
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-8 professional-text">
                    השלב הראשון והחשוב ביותר הוא הבנה מעמיקה של הסגנון האישי של בת הזוג. 
                    כל אישה ייחודית בטעמה ובהעדפותיה, והטבעת צריכה לשקף את האישיות שלה.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <Crown className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">העדפות תכשיטים</h4>
                      <p className="text-gray-600 professional-text">
                        בחינת התכשיטים הקיימים שלה - האם מעדיפה עיצובים עדינים וקלאסיים 
                        או תכשיטים בולטים ומרשימים יותר.
                      </p>
                    </div>
                    
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <Sparkles className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">אסתטיקה עיצובית</h4>
                      <p className="text-gray-600 professional-text">
                        זיהוי העדפות עיצוביות - מודרני מול קלאסי, מינימליסטי מול מקושט, 
                        גיאומטרי מול אורגני.
                      </p>
                    </div>
                    
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <Star className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">סוג המתכת</h4>
                      <p className="text-gray-600 professional-text">
                        בחירת סוג הזהב - זהב לבן לאלגנטיות מודרנית, זהב צהוב לקלאסיקה חמה, 
                        או זהב ורוד לייחודיות רומנטית.
                      </p>
                    </div>
                    
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <Diamond className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">סגנון השיבוץ</h4>
                      <p className="text-gray-600 professional-text">
                        החלטה בין סוליטר קלאסי לעומת שיבוצים מורכבים יותר עם יהלומים נוספים 
                        או אבני חן משלימות.
                      </p>
                    </div>
                  </div>
                  
                  <div className="luxury-highlight mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 ml-2 text-gold" />
                      המלצה מקצועית
                    </h4>
                    <p className="text-gray-700 professional-text">
                      הקדישו זמן לבחינת התכשיטים שהיא כבר עונדת ושימו לב לסגנון הלבוש הכללי שלה. 
                      זה יעזור לכם להבין את ההעדפות שלה מבלי לחשוף את ההפתעה.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - The 4 C's */}
            <div className="professional-card rtl-content">
              <div className="flex items-start">
                <div className="step-indicator">2</div>
                <div className="step-content">
                  <h3 className="text-3xl font-medium text-gray-900 mb-6 luxury-text">
                    ארבעת הקריטריונים למעלה יהלום (4 C's)
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-8 professional-text">
                    ארבעת הקריטריונים הבינלאומיים לדירוג איכות יהלומים. הבנה מעמיקה של 
                    הפרמטרים הללו חיונית לבחירה מושכלת.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <TrendingUp className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">Carat (קראט) - המשקל</h4>
                      <p className="text-gray-600 professional-text">
                        יחידת המשקל הסטנדרטית של יהלומים. קראט אחד שווה ל-200 מיליגרם. 
                        המשקל משפיע ישירות על הגודל הנראה למעין ועל המחיר.
                      </p>
                    </div>
                    
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <Gem className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">Cut (חיתוך) - הליטוש</h4>
                      <p className="text-gray-600 professional-text">
                        איכות החיתוך קובעת את הברק והניצוץ של היהלום. חיתוך מושלם מחזיר 
                        את האור בצורה מיטבית ויוצר את הניצוץ המרהיב.
                      </p>
                    </div>
                    
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <Eye className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">Clarity (ניקיון) - טוהר</h4>
                      <p className="text-gray-600 professional-text">
                        מידת הנקיון של היהלום מפגמים פנימיים וחיצוניים. ככל שהיהלום נקי יותר, 
                        כך הוא נדיר ויקר יותר.
                      </p>
                    </div>
                    
                    <div className="diamond-feature">
                      <div className="professional-icon">
                        <Star className="w-6 h-6 text-gray-900" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-xl">Color (צבע) - גוון</h4>
                      <p className="text-gray-600 professional-text">
                        דירוג צבע היהלום על סולם D-Z. יהלומים חסרי צבע (D-F) נחשבים 
                        למעולים ויקרים ביותר.
                      </p>
                    </div>
                  </div>
                  
                  <div className="luxury-highlight mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Diamond className="w-5 h-5 ml-2 text-gold" />
                      עדיפויות השקעה חכמה
                    </h4>
                    <p className="text-gray-700 professional-text">
                      בתקציב מוגבל, השקיעו קודם כל בחיתוך מעולה - זה מה שקובע את הברק. 
                      לאחר מכן בגודל המתאים, ולבסוף באיזון בין ניקיון לצבע לפי ההעדפות האישיות.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Budget Planning */}
            <div className="professional-card rtl-content">
              <div className="flex items-start">
                <div className="step-indicator">3</div>
                <div className="step-content">
                  <h3 className="text-3xl font-medium text-gray-900 mb-6 luxury-text">
                    תכנון תקציב חכם ואסטרטגי
                  </h3>
                  
                  <p className="text-lg text-gray-700 mb-8 professional-text">
                    קביעת תקציב ריאלי ומותאם לכם היא הבסיס לבחירה נכונה. תקציב מתוכנן מראש 
                    מאפשר להתמקד באיכות ובפרטים שחשובים באמת.
                  </p>
                  
                  <ul className="professional-list">
                    <li className="professional-list-item">
                      <Shield className="w-5 h-5 icon" />
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">הימנעות מחובות</h5>
                        <p className="text-gray-600 professional-text">
                          טבעת האירוסין היא השקעה משמעותית, אך חשוב שלא תעמיס עליכם כלכלית. 
                          קבעו תקציב שמתאים למצבכם הכלכלי הנוכחי.
                        </p>
                      </div>
                    </li>
                    
                    <li className="professional-list-item">
                      <TrendingUp className="w-5 h-5 icon" />
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">איזון בין איכות לגודל</h5>
                        <p className="text-gray-600 professional-text">
                          במקום להתמקד רק בגודל היהלום, חפשו את האיזון הנכון בין כל הפרמטרים. 
                          לעיתים יהלום קטן יותר באיכות גבוהה ייראה מרשים יותר.
                        </p>
                      </div>
                    </li>
                    
                    <li className="professional-list-item">
                      <Award className="w-5 h-5 icon" />
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">התמקדות בערך ארוך טווח</h5>
                        <p className="text-gray-600 professional-text">
                          בחרו בטבעת באיכות שתעמוד לאורך שנים. השקעה באיכות גבוהה היא השקעה 
                          לכל החיים ותשמור על ערך הטבעת לאורך זמן.
                        </p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="luxury-highlight mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 ml-2 text-gold" />
                      חוכמת השוק
                    </h4>
                    <p className="text-gray-700 professional-text">
                      השווי האמיתי של טבעת האירוסין לא נמדד רק בכסף, אלא באיכות, ביופי ובמשמעות הרגשית. 
                      בחרו טבעת שגם אתם וגם בת הזוג תוכלו להתגאות בה לאורך כל החיים.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Consultation CTA */}
            <div className="luxury-cta">
              <h3 className="text-3xl font-light mb-6 luxury-text">
                זקוקים לייעוץ מקצועי אישי?
              </h3>
              <p className="text-xl mb-8 opacity-90 professional-text">
                המומחים שלנו ב-LIBI DIAMONDS עומדים לרשותכם לייעוץ אישי ומקצועי. 
                נעזור לכם לבחור את הטבעת המושלמת בדיוק לפי הצרכים והתקציב שלכם.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/contact" 
                  className="premium-button inline-flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 ml-2" />
                  קבעו פגישת ייעוץ
                </Link>
                <Link 
                  to="/products" 
                  className="premium-button inline-flex items-center justify-center"
                >
                  <Diamond className="w-5 h-5 ml-2" />
                  צפו בקולקציה
                </Link>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg opacity-75 professional-text">
                  שירות ייעוץ מקצועי ללא תשלום | מומחיות של שנים | שירות אישי ודיסקרטי
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default EngagementRingGuide; 