import React from 'react';
import PageSEO from '../components/SEO/PageSEO';
import { motion } from 'framer-motion';

const About = () => {
  // Breadcrumbs for structured data
  const breadcrumbs = [
    { name: 'דף הבית', url: '/' },
    { name: 'אודותינו', url: '/about' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* SEO Configuration */}
      <PageSEO 
        page="about"
        title="אודותינו - ליבי תכשיטים | יהלומי מעבדה איכותיים"
        description="ליבי תכשיטים - תכשיטים שמכילים יופי וערכים. יהלומי מעבדה איכותיים במחירים הוגנים. בחירה מוסרית ויהלומים אמיתיים עם תעודות GIA."
        canonical="https://libi-jewelry.com/about"
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            אודותינו
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ליבי תכשיטים – תכשיטים שמכילים גם יופי וגם ערכים
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Our Philosophy Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  הפילוסופיה שלנו
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  בליבי תכשיטים אנחנו מאמינים שאפשר לשלב יוקרה עם מוסר, אלגנטיות עם אחריות, ויופי עם כוונה טובה. 
                  לכן בחרנו להתמקד אך ורק ביהלומי מעבדה – היהלומים החדשים של הדור הבא.
                </p>
                <div className="flex items-center space-x-reverse space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">💎</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">יהלומי מעבדה איכותיים</h3>
                    <p className="text-gray-600">אותו יהלום, מצפון שקט</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-4xl">💍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">תכשיטי יוקרה</h3>
                    <p className="text-gray-700">עם ערכים</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Fair Pricing Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              תכשיט יוקרתי – במחיר הוגן
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              אנחנו מתחייבים לספק לכם את היהלום הטוב ביותר – במחיר הנמוך ביותר. איך זה קורה?
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">❌ מה שאנחנו לא עושים</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    לא חנות פיזית
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    לא משלמים שכירות בקניון
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    לא מחזיקים עובדים על רצפת מכירה
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    לא גובים על "החוויה"
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">✅ מה שאנחנו כן עושים</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    תכשיט מדויק
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    רמת גימור גבוהה
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    יהלום איכותי
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    מחיר נטו הוגן
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center bg-yellow-100 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">התוצאה:</h3>
              <p className="text-xl text-gray-800">תכשיטים מרהיבים – בלי לשלם על מה שלא באמת חשוב</p>
            </div>
          </motion.section>

          {/* Why Not Natural Diamond Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              למה לא יהלום טבעי?
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  הרבה אנשים לא יודעים, אבל מאחורי הברק המנצנץ של יהלומים טבעיים – מסתתר לעיתים סיפור כואב. 
                  בסרט "Blood Diamond" נחשף לעולם הצד האפל של תעשיית היהלומים – ילדים מגויסים בכפייה, תנאי עבדות, 
                  אלימות קשה, ומימון מלחמות אכזריות באפריקה.
                </p>
                <div className="bg-red-50 border-r-4 border-red-400 p-4 mb-6">
                  <p className="text-red-800 font-semibold">
                    תכשיט שאמור לסמל אהבה – לעיתים נולד מתוך סבל.
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  אנחנו מאמינים שאפשר אחרת.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-4xl">⚖️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">בחירה מוסרית</h3>
                    <p className="text-gray-700">ללא פגיעה</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Lab Diamond Benefits Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 md:p-12 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              יהלום מעבדה – אותו יהלום. מצפון שקט.
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              יהלומי מעבדה הם יהלומים אמיתיים לכל דבר – זהים לחלוטין ליהלומים טבעיים בהרכב הכימי, 
              בתכונות הפיזיקליות ובברק הייחודי. ההבדל היחיד? הדרך בה הם נוצרו – בתנאים בטוחים, נקיים, וללא פגיעה באף אחד.
            </p>
          </motion.section>

          {/* Comparison Table Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              השוואה בין יהלום טבעי ליהלום מעבדה
            </h2>
            
            {/* Comparison Chart - Recreating the image content */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8">
                <div className="col-span-1 space-y-4">
                  <div className="text-right font-semibold text-gray-700 py-3">APPEARANCE</div>
                  <div className="text-right font-semibold text-gray-700 py-3">CHEMICAL COMPOSITION</div>
                  <div className="text-right font-semibold text-gray-700 py-3">MOHS SCALE HARDNESS</div>
                  <div className="text-right font-semibold text-gray-700 py-3">REFRACTIVE INDEX</div>
                  <div className="text-right font-semibold text-gray-700 py-3">CRYSTAL STRUCTURE</div>
                  <div className="text-right font-semibold text-gray-700 py-3">DISPERSION</div>
                  <div className="text-right font-semibold text-gray-700 py-3">DENSITY</div>
                </div>
                
                <div className="col-span-1 space-y-4 text-center">
                  <div className="py-3">
                    <div className="w-16 h-16 mx-auto mb-2">💎</div>
                    <div className="font-semibold">Lab Grown diamond</div>
                  </div>
                  <div className="py-3 text-red-600 font-bold">CARBON</div>
                  <div className="py-3 text-red-600 font-bold">10</div>
                  <div className="py-3 text-red-600 font-bold">2.42</div>
                  <div className="py-3 text-red-600 font-bold">Cubic</div>
                  <div className="py-3 text-red-600 font-bold">10</div>
                  <div className="py-3 text-red-600 font-bold">3.52</div>
                </div>
                
                <div className="col-span-1 space-y-4 text-center">
                  <div className="py-3">
                    <div className="w-12 h-12 mx-auto mb-2">💎</div>
                    <div className="font-semibold text-sm">Natural diamond</div>
                  </div>
                  <div className="py-3 text-gray-600 font-bold">CARBON</div>
                  <div className="py-3 text-gray-600 font-bold">10</div>
                  <div className="py-3 text-gray-600 font-bold">2.42</div>
                  <div className="py-3 text-gray-600 font-bold">Cubic</div>
                  <div className="py-3 text-gray-600 font-bold">10</div>
                  <div className="py-3 text-gray-600 font-bold">3.52</div>
                </div>
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">המסקנה:</h3>
                <p className="text-lg text-gray-700">
                  יהלומי מעבדה זהים לחלוטין ליהלומים טבעיים בכל התכונות הפיזיקליות והכימיות
                </p>
              </div>
            </div>
          </motion.section>

          {/* Our Choice Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              הבחירה שלנו – וההזדמנות שלך
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  אנחנו בוחרים להביא יהלומים שמהווים סמל לא רק ליופי – אלא גם לבחירה מוסרית.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  בליבי תכשיטים תמצאו תכשיטים מרהיבים עם יהלומי מעבדה איכותיים, כל אחד מהם מגיע עם אישור 
                  <span className="font-bold"> GIA או IGI</span> – תעודה רשמית שמוכיחה את האיכות והאותנטיות של כל יהלום.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                    <span className="font-semibold text-blue-600">GIA Certified</span>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                    <span className="font-semibold text-green-600">IGI Certified</span>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                    <span className="font-semibold text-purple-600">איכות מובטחת</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-4xl">🏆</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">איכות מוכחת</h3>
                    <p className="text-gray-700">עם תעודות רשמיות</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default About; 