import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, Eye, ChevronLeft, Search, TrendingUp, BookOpen } from 'lucide-react';
import PageSEO from '../components/SEO/PageSEO';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: "lab-diamonds-guide",
      title: "יהלומי מעבדה: המדריך המקצועי המלא",
      excerpt: "כל מה שרציתם לדעת על יהלומי מעבדה: איך הם נוצרים, מה ההבדלים מיהלומים טבעיים, ולמה הם העתיד של תעשיית התכשיטים. מדריך מקיף הכולל השוואת מחירים, איכות וטכנולוגיות ייצור מתקדמות.",
      category: "מדריכים מקצועיים",
      author: "צוות LIBI DIAMONDS",
      published: "15 בפברואר 2024",
      readTime: "10 דקות קריאה",
      views: "2,847",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop",
      link: "/lab-diamonds-guide",
      featured: true,
      tags: ["יהלומי מעבדה", "טכנולוגיה", "השוואה", "מחירים"]
    },
    {
      id: "engagement-ring-guide",
      title: "איך לבחור טבעת אירוסין מושלמת: המדריך המלא",
      excerpt: "כל מה שצריך לדעת על בחירת טבעת האירוסין הנכונה - מגודל היהלום ועד לסגנון התפאורה שיתאים לכם בדיוק. כולל טיפים למציאת המחיר הטוב ביותר ועצות מעצבי תכשיטים מקצועיים.",
      category: "טבעות אירוסין",
      author: "צוות LIBI DIAMONDS",
      published: "22 בפברואר 2024",
      readTime: "7 דקות קריאה",
      views: "1,923",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
      link: "/engagement-ring-guide",
      featured: false,
      tags: ["טבעות אירוסין", "בחירה", "מדריך", "יהלומים"]
    },
    {
      id: "diamond-care-guide",
      title: "המדריך המקצועי לטיפוח ושמירה על תכשיטי יהלום",
      excerpt: "למדו את הדרכים הטובות ביותר לשמור על הברק והיופי של התכשיטים שלכם לאורך שנים רבות. כולל מתכונים לניקוי ביתי, טיפים למניעת נזקים ומתי לפנות לשירות מקצועי.",
      category: "טיפוח ותחזוקה",
      author: "צוות LIBI DIAMONDS",
      published: "1 במרץ 2024",
      readTime: "5 דקות קריאה",
      views: "1,456",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
      link: "/diamond-care-guide",
      featured: false,
      tags: ["טיפוח", "תחזוקה", "ניקוי", "שמירה"]
    }
  ];

  const categories = [
    { id: 'all', name: 'כל הקטגוריות' },
    { id: 'מדריכים מקצועיים', name: 'מדריכים מקצועיים' },
    { id: 'טבעות אירוסין', name: 'טבעות אירוסין' },
    { id: 'טיפוח ותחזוקה', name: 'טיפוח ותחזוקה' }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
      <PageSEO 
        page="blog"
        title="הבלוג שלנו - מדריכים ועצות מקצועיות"
        description="קראו את המדריכים המקצועיים שלנו על יהלומי מעבדה, טבעות אירוסין וטיפוח תכשיטים. עצות מומחים וכל מה שרציתם לדעת על עולם התכשיטים."
        canonical="https://libi-jewelry.com/blog"
      />

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&display=swap');
        
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.2);
        }
        
        .elegant-button {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #8b5a00;
          font-weight: 600;
          transition: all 0.3s ease;
          border-radius: 25px;
        }
        
        .elegant-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
          background: linear-gradient(135deg, #e6c558, #f4e4bc);
        }
        
        .text-elegant {
          color: #2c3e50;
          font-family: 'Heebo', sans-serif;
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
        
        .luxury-text {
          font-family: 'Frank Ruhl Libre', 'Heebo', serif;
          font-weight: 500;
          letter-spacing: 0.025em;
        }
        
        .blog-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .blog-card-hover:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .featured-overlay {
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            transparent 100%
          );
        }
        
        .search-input {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .search-input:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        
        .category-pill {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          transition: all 0.3s ease;
        }
        
        .category-pill:hover, .category-pill.active {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          color: #8b5a00;
          border-color: rgba(212, 175, 55, 0.4);
        }
        
        .aspect-video {
          aspect-ratio: 16 / 9;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .glass-card {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(5px);
          }
        }
      `}</style>

      {/* Header Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-rose-100/20" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-elegant mb-8 luxury-text">
              הבלוג שלנו
            </h1>
            <div className="section-divider w-32 mb-8" />
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12 font-light">
              מדריכים מקצועיים, עצות מומחים וכל מה שרציתם לדעת על עולם התכשיטים ויהלומי המעבדה
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חיפוש מאמרים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-6 py-4 rounded-full search-input text-elegant font-light"
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 category-pill ${
                      selectedCategory === category.id ? 'active' : ''
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-gold ml-2" />
                <h2 className="text-2xl md:text-3xl font-medium text-elegant">מאמר מומלץ</h2>
              </div>
              <div className="section-divider w-24" />
            </div>

            <Link to={featuredPost.link} className="block group">
              <div className="glass-card overflow-hidden blog-card-hover">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 featured-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                        מומלץ
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                        <Tag className="w-3 h-3 ml-1" />
                        {featuredPost.category}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-medium text-elegant mb-4 leading-tight group-hover:text-gold transition-colors duration-300">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed font-light">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="flex items-center">
                          <User className="w-4 h-4 ml-1" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 ml-1" />
                          {featuredPost.published}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 ml-1" />
                          {featuredPost.readTime}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 ml-1" />
                          {featuredPost.views}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-gold group-hover:text-yellow-600 transition-colors duration-300">
                      <span className="font-medium">קרא עוד</span>
                      <ChevronLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-gold ml-2" />
              <h2 className="text-2xl md:text-3xl font-medium text-elegant">כל המאמרים</h2>
            </div>
            <div className="section-divider w-24" />
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="glass-card p-12 max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">לא נמצאו מאמרים</h3>
                <p className="text-gray-500">נסו לשנות את מונחי החיפוש או הקטגוריה</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link to={post.link} className="block">
                    <div className="glass-card overflow-hidden h-full flex flex-col blog-card-hover">
                      <div className="relative overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                            <Tag className="w-3 h-3 ml-1" />
                            {post.category}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-elegant mb-3 leading-tight group-hover:text-gold transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-1 font-light">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 ml-1" />
                            {post.published}
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 ml-1" />
                              {post.readTime}
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 ml-1" />
                              {post.views}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gold group-hover:text-yellow-600 transition-colors duration-300">
                          <span className="text-sm font-medium">קרא עוד</span>
                          <ChevronLeft className="w-4 h-4 mr-2 group-hover:transform group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="glass-card p-12">
            <h3 className="text-2xl md:text-3xl font-medium text-elegant mb-6 luxury-text">
              הישארו מעודכנים
            </h3>
            <div className="section-divider w-24 mb-8" />
            <p className="text-gray-600 mb-8 leading-relaxed font-light">
              הירשמו לניוזלטר שלנו ותקבלו עדכונים על מאמרים חדשים, מדריכים מקצועיים והצעות מיוחדות
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="הכניסו את כתובת האימייל שלכם"
                className="flex-1 px-6 py-3 rounded-full search-input text-elegant font-light"
              />
              <button className="elegant-button px-8 py-3 rounded-full whitespace-nowrap">
                הרשמה לניוזלטר
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;