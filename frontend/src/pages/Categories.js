import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Grid3X3, Sparkles, Diamond, ArrowLeft, Tag, Eye, Filter, ChevronDown } from 'lucide-react';
import PageSEO from '../components/SEO/PageSEO';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.filter(cat => cat.is_active));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const GlassCard = ({ children, className = "" }) => (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Grid3X3 className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 font-light text-lg">טוען קטגוריות...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <PageSEO 
        title="קטגוריות תכשיטים"
        description="גלו את מגוון הקטגוריות שלנו - טבעות אירוסין, עגילים, שרשראות, צמידים ועוד. כל התכשיטים עם יהלומי מעבדה איכותיים."
        keywords="קטגוריות תכשיטים, טבעות אירוסין, עגילים, שרשראות, צמידים, יהלומי מעבדה"
        pageType="website"
        breadcrumbs={[
          { name: 'דף הבית', url: '/' },
          { name: 'קטגוריות', url: '/categories' }
        ]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
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
            transform: translateY(-8px);
            border-color: rgba(212, 175, 55, 0.2);
          }
          
          .category-card {
            position: relative;
            overflow: hidden;
            height: 280px;
            border-radius: 24px;
            cursor: pointer;
          }
          
          .category-image {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            object-fit: cover;
            transition: transform 0.6s ease;
          }
          
          .category-card:hover .category-image {
            transform: scale(1.1);
          }
          
          .category-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.1) 0%,
              rgba(0, 0, 0, 0.3) 50%,
              rgba(0, 0, 0, 0.7) 100%
            );
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 2rem;
            transition: all 0.4s ease;
          }
          
          .category-card:hover .category-overlay {
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.2) 0%,
              rgba(0, 0, 0, 0.4) 50%,
              rgba(0, 0, 0, 0.8) 100%
            );
          }
          
          .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #d4af37 20%, #d4af37 80%, transparent 100%);
            margin: 0 auto;
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
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
          }
          
          .elegant-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(212, 175, 55, 0.6);
            background: linear-gradient(135deg, #e6c558, #f4e4bc, #e6c558);
            border-color: rgba(212, 175, 55, 0.6);
            text-decoration: none;
            color: #8b5a00;
          }

          .hero-banner {
            position: relative;
            height: 300px;
            background: 
                        url('/CategoriesImage.png');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .hero-content {
            text-align: center;
            z-index: 2;
            max-width: 600px;
            padding: 0 2rem;
          }

          .filter-dropdown {
            position: relative;
            display: inline-block;
          }

          .filter-button {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(212, 175, 55, 0.2);
            border-radius: 12px;
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            color: #2c3e50;
          }

          .filter-button:hover {
            background: rgba(255, 255, 255, 1);
            border-color: #d4af37;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
          }

          .filter-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            z-index: 10;
            min-width: 200px;
            padding: 0.5rem 0;
            margin-top: 0.5rem;
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
            transition: all 0.3s ease;
          }

          .filter-dropdown:hover .filter-menu,
          .filter-dropdown.active .filter-menu {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
          }

          .filter-option {
            padding: 0.75rem 1rem;
            cursor: pointer;
            transition: background-color 0.2s ease;
            font-size: 0.9rem;
            color: #2c3e50;
          }

          .filter-option:hover {
            background: rgba(212, 175, 55, 0.1);
          }

          .filter-option.active {
            background: rgba(212, 175, 55, 0.2);
            color: #8b5a00;
            font-weight: 500;
          }
        `}</style>

        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
              קטגוריות התכשיטים
            </h1>
            <p className="text-xl text-white/90 font-light leading-relaxed">
              גלו את מגוון הקולקציות הייחודיות שלנו
            </p>
          </div>
        </div>

        <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filter Section */}
            <div className="flex justify-between items-center mb-12">
              <p className="text-gray-600">
                נמצאו <span className="font-medium text-yellow-600">{sortedCategories.length}</span> קטגוריות
              </p>
              
              <div className="filter-dropdown">
                <div 
                  className="filter-button"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="w-4 h-4" />
                  <span>מיון לפי</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </div>
                
                <div className={`filter-menu ${filterOpen ? 'active' : ''}`}>
                  <div 
                    className={`filter-option ${sortBy === 'name' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('name');
                      setFilterOpen(false);
                    }}
                  >
                    שם א-ת
                  </div>
                  <div 
                    className={`filter-option ${sortBy === 'name-desc' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('name-desc');
                      setFilterOpen(false);
                    }}
                  >
                    שם ת-א
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            {sortedCategories.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {sortedCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link to={`/products?category=${category.id}`}>
                      <div className="category-card glass-card">
                        {category.image_url ? (
                          <img
                            src={category.image_url.startsWith('http') 
                              ? category.image_url 
                              : `http://localhost:8001${category.image_url}`}
                            alt={category.name}
                            className="category-image"
                          />
                        ) : (
                          <div className="category-image bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                            <Diamond className="w-16 h-16 text-white opacity-80" />
                          </div>
                        )}
                        
                        <div className="category-overlay">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                                <Eye className="w-4 h-4 text-white ml-1" />
                                <span className="text-white text-sm">צפה במוצרים</span>
                              </div>
                              <ArrowLeft className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
                            </div>
                            
                            <h3 className="text-2xl font-medium text-white mb-2">
                              {category.name}
                            </h3>
                            
                            {category.description && (
                              <p className="text-white/90 font-light leading-relaxed">
                                {category.description}
                              </p>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
              >
                <GlassCard className="max-w-md mx-auto p-12">
                  <div className="text-amber-400 mb-6">
                    <Grid3X3 className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 mb-4">
                    לא נמצאו קטגוריות
                  </h3>
                  <div className="section-divider w-24 mb-6" />
                  <p className="text-gray-600 font-light">
                    אין קטגוריות זמינות כרגע
                  </p>
                </GlassCard>
              </motion.div>
            )}

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-20"
            >
              <GlassCard className="max-w-4xl mx-auto p-12">
                <div className="flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-3xl font-light text-gray-900 mb-4">
                  לא מצאתם את מה שחיפשתם?
                </h2>
                <div className="section-divider w-24 mb-6" />
                <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                  הצוות המקצועי שלנו יעזור לכם למצוא את התכשיט המושלם או ליצור עיצוב מותאם אישית במיוחד עבורכם.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/products" className="elegant-button">
                    <Tag className="w-4 h-4 ml-2" />
                    צפו בכל המוצרים
                  </Link>
                  <a href="tel:03-1234567" className="elegant-button">
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    צרו קשר לייעוץ
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories; 