import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEO_CONFIG, { PAGE_SEO } from '../../seo/seo.config';

const PageSEO = ({ 
  page = 'home', 
  title = null, 
  description = null, 
  canonical = null,
  image = null,
  noindex = false,
  product = null,
  breadcrumbs = null
}) => {
  // Get page-specific SEO config
  const pageConfig = PAGE_SEO[page] || PAGE_SEO.home;
  
  // Override with custom values if provided
  const seoTitle = title || pageConfig.title;
  const seoDescription = description || pageConfig.description;
  const seoCanonical = canonical || pageConfig.canonical;
  
  // Build the final title
  const finalTitle = seoTitle === 'דף הבית' 
    ? SEO_CONFIG.defaultTitle 
    : `${seoTitle} | ליבי תכשיטים - יהלומי מעבדה איכותיים`;

  // Get the main image
  const mainImage = image || SEO_CONFIG.openGraph.images[0].url;

  // Create advanced organization schema with more details
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://libi-jewelry.com/#organization",
    "name": "ליבי תכשיטים",
    "alternateName": "Libi Jewelry",
    "url": "https://libi-jewelry.com",
    "logo": "https://libi-jewelry.com/logo.png",
    "description": "החנות המובילה ביהלומי מעבדה איכותיים בישראל - טבעות אירוסין, עגילים, שרשראות ותכשיטי יוקרה",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "רחוב הדוגמה 123",
      "addressLocality": "תל אביב",
      "addressRegion": "מרכז",
      "postalCode": "12345",
      "addressCountry": "IL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "32.0853",
      "longitude": "34.7818"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+972-3-1234567",
      "contactType": "customer service",
      "areaServed": "IL",
      "availableLanguage": ["Hebrew", "English"],
      "email": "info@libi-jewelry.com"
    },
    "openingHours": [
      "Su-Th 09:00-18:00",
      "Fr 09:00-14:00"
    ],
    "priceRange": "$$",
    "currenciesAccepted": "ILS",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "Bit"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "247"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "שרה כהן"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "טבעת האירוסין עם יהלום מעבדה הייתה מושלמת! האיכות מדהימה והמחיר הוגן בהרבה."
      }
    ],
    "sameAs": [
      "https://www.facebook.com/LibiJewelry",
      "https://www.instagram.com/LibiJewelry",
      "https://www.linkedin.com/company/libi-jewelry"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "יהלומי מעבדה איכותיים",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "טבעות אירוסין יהלום מעבדה"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "עגילי יהלום מעבדה"
          }
        }
      ]
    }
  };

  // Create breadcrumbs schema if provided
  const breadcrumbsSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://libi-jewelry.com${item.url}`
    }))
  } : null;

  // Enhanced product schema with more details
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images,
    "sku": product.sku,
    "mpn": product.mpn || product.sku,
    "brand": {
      "@type": "Brand",
      "name": "ליבי תכשיטים",
      "@id": "https://libi-jewelry.com/#organization"
    },
    "category": product.category || "תכשיטים",
    "material": "יהלום מעבדה",
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "ILS",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "ליבי תכשיטים",
        "@id": "https://libi-jewelry.com/#organization"
      },
      "url": `https://libi-jewelry.com/products/${product.id}`,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating", 
      "ratingValue": product.rating.average,
      "reviewCount": product.rating.count
    } : undefined,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "סוג יהלום",
        "value": "יהלום מעבדה איכותי"
      },
      {
        "@type": "PropertyValue", 
        "name": "מקור",
        "value": "ידידותי לסביבה"
      }
    ]
  } : null;

  // Enhanced website schema for e-commerce
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://libi-jewelry.com/#website",
    "url": "https://libi-jewelry.com",
    "name": "ליבי תכשיטים",
    "description": "החנות המובילה ביהלומי מעבדה איכותיים בישראל",
    "publisher": {
      "@id": "https://libi-jewelry.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://libi-jewelry.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "he-IL"
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="author" content="ליבי תכשיטים" />
      
      {/* Enhanced Language and Direction */}
      <html lang="he" dir="rtl" />
      
      {/* Canonical URL */}
      {seoCanonical && <link rel="canonical" href={seoCanonical} />}
      
      {/* Robots with enhanced directives */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1'} />
      
      {/* Enhanced Keywords with long-tail variations */}
      <meta name="keywords" content="יהלומי מעבדה איכותיים, טבעות אירוסין יהלום מעבדה, תכשיטי יוקרה ישראל, עגילי יהלום, שרשראות יהלום, צמידי יהלום, יהלומים סינתטיים, lab grown diamonds israel, ליבי תכשיטים, תכשיטים ידידותיים לסביבה, יהלומים אתיים, מחירי יהלומי מעבדה" />
      
      {/* Core Web Vitals and Performance hints */}
      <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
      <meta name="theme-color" content="#d4af37" />
      <meta name="msapplication-TileColor" content="#d4af37" />
      <meta name="color-scheme" content="light" />
      
      {/* Enhanced App Names */}
      <meta name="application-name" content="ליבי תכשיטים" />
      <meta name="apple-mobile-web-app-title" content="ליבי תכשיטים" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Enhanced Geographic targeting */}
      <meta name="geo.region" content="IL" />
      <meta name="geo.placename" content="ישראל" />
      <meta name="geo.position" content="32.0853;34.7818" />
      <meta name="ICBM" content="32.0853, 34.7818" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Business Contact Data */}
      <meta property="business:contact_data:locality" content="תל אביב" />
      <meta property="business:contact_data:region" content="מרכז" />
      <meta property="business:contact_data:country_name" content="ישראל" />
      <meta property="business:contact_data:phone_number" content="+972-3-1234567" />
      <meta property="business:contact_data:email" content="info@libi-jewelry.com" />
      
      {/* Enhanced Open Graph with more details */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:site_name" content="ליבי תכשיטים" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={mainImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoTitle} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content={mainImage} />
      
      {/* E-commerce specific Open Graph */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content="ILS" />
          <meta property="product:availability" content={product.inStock ? "in stock" : "out of stock"} />
          <meta property="product:condition" content="new" />
          <meta property="product:brand" content="ליבי תכשיטים" />
        </>
      )}
      
      {/* Enhanced Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@LibiJewelry" />
      <meta name="twitter:creator" content="@LibiJewelry" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={mainImage} />
      <meta name="twitter:image:alt" content={seoTitle} />
      
      {/* Site verification tags */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
      <meta name="yandex-verification" content="YOUR_YANDEX_VERIFICATION_CODE" />
      
      {/* Enhanced Favicons and Icons */}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#d4af37" />
      
      {/* Performance optimization preloads */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="he" href="https://libi-jewelry.com/" />
      <link rel="alternate" hrefLang="en" href="https://libi-jewelry.com/en" />
      <link rel="alternate" hrefLang="x-default" href="https://libi-jewelry.com/" />
      
      {/* RSS Feed */}
      <link rel="alternate" type="application/rss+xml" title="ליבי תכשיטים - עדכונים" href="https://libi-jewelry.com/rss.xml" />
      
      {/* Enhanced Structured Data - Website */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Structured Data - Breadcrumbs */}
      {breadcrumbsSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbsSchema)}
        </script>
      )}
      
      {/* Structured Data - Product */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default PageSEO; 