import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Package, Tag, Users, TrendingUp, Plus, Gem, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      
      setStats({
        products: productsRes.data.length,
        categories: categoriesRes.data.length,
        users: 0 // Add user count endpoint if needed
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'מוצרים',
      value: stats.products,
      icon: Package,
      link: '/admin/products',
      color: 'bg-blue-500'
    },
    {
      title: 'קטגוריות',
      value: stats.categories,
      icon: Tag,
      link: '/admin/categories',
      color: 'bg-green-500'
    },
    {
      title: 'משתמשים',
      value: stats.users,
      icon: Users,
      link: '#',
      color: 'bg-purple-500'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">לוח בקרה של מנהל</h1>
          <p className="text-gray-600">ברוכים הבאים לפאנל הניהול של LIBI DIAMONDS</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-full text-white ml-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">פעולות מהירות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gold hover:bg-yellow-50 transition-colors duration-200"
            >
              <div className="bg-gold p-2 rounded-lg ml-3">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">הוסף מוצר חדש</h3>
                <p className="text-sm text-gray-600">צור מוצר חדש בחנות</p>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gold hover:bg-yellow-50 transition-colors duration-200"
            >
              <div className="bg-gold p-2 rounded-lg ml-3">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">הוסף קטגוריה חדשה</h3>
                <p className="text-sm text-gray-600">צור קטגוריה חדשה למוצרים</p>
              </div>
            </Link>

            <Link
              to="/admin/carat-pricing"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gold hover:bg-yellow-50 transition-colors duration-200"
            >
              <div className="bg-gold p-2 rounded-lg ml-3">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">ניהול תמחור קראטים</h3>
                <p className="text-sm text-gray-600">הגדר מחירי קראטים גלובליים</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ניהול החנות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gold hover:bg-yellow-50 transition-colors duration-200"
            >
              <Package className="w-6 h-6 text-gold ml-3" />
              <div>
                <h3 className="font-medium text-gray-900">ניהול מוצרים</h3>
                <p className="text-sm text-gray-600">הוסף, ערוך ומחק מוצרים</p>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gold hover:bg-yellow-50 transition-colors duration-200"
            >
              <Tag className="w-6 h-6 text-gold ml-3" />
              <div>
                <h3 className="font-medium text-gray-900">ניהול קטגוריות</h3>
                <p className="text-sm text-gray-600">הוסף, ערוך ומחק קטגוריות</p>
              </div>
            </Link>

            <Link
              to="/admin/carat-pricing"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gold hover:bg-yellow-50 transition-colors duration-200"
            >
              <Gem className="w-6 h-6 text-gold ml-3" />
              <div>
                <h3 className="font-medium text-gray-900">תמחור קראטים</h3>
                <p className="text-sm text-gray-600">הגדר מכפילי מחיר לקראטים</p>
              </div>
            </Link>

            <Link
              to="/admin/product-carats"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gold hover:bg-yellow-50 transition-colors duration-200"
            >
              <Settings className="w-6 h-6 text-gold ml-3" />
              <div>
                <h3 className="font-medium text-gray-900">קראטים למוצרים</h3>
                <p className="text-sm text-gray-600">הגדר אילו קראטים זמינים לכל מוצר</p>
              </div>
            </Link>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
              <Users className="w-6 h-6 text-gray-400 ml-3" />
              <div>
                <h3 className="font-medium text-gray-400">ניהול משתמשים</h3>
                <p className="text-sm text-gray-400">בקרוב...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;