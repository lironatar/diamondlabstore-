import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEO_CONFIG from '../../seo/seo.config';

const DefaultSEO = () => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{SEO_CONFIG.defaultTitle}</title>
      <meta name="description" content={SEO_CONFIG.description} />
      <meta name="author" content="ליבי תכשיטים" />
      
      {/* HTML lang attribute */}
      <html lang="he" dir="rtl" />
      
      {/* Robots */}
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="googlebot" content="index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1" />
      
      {/* Keywords */}
      <meta name="keywords" content="יהלומי מעבדה, טבעות אירוסין, תכשיטים, יהלומים, זהב, כסף, עגילים, שרשראות, צמידים, ליבי תכשיטים, תכשיטי יוקרה, יהלומים סינתטיים, lab grown diamonds" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#d4af37" />
      <meta name="msapplication-TileColor" content="#d4af37" />
      
      {/* App Names */}
      <meta name="application-name" content="ליבי תכשיטים" />
      <meta name="apple-mobile-web-app-title" content="ליבי תכשיטים" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Geographic and Business Info */}
      <meta name="geo.region" content="IL" />
      <meta name="geo.placename" content="ישראל" />
      <meta name="ICBM" content="32.0853, 34.7818" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Business Contact Data */}
      <meta property="business:contact_data:locality" content="ישראל" />
      <meta property="business:contact_data:region" content="מרכז" />
      <meta property="business:contact_data:country_name" content="ישראל" />
      
      {/* Open Graph */}
      <meta property="og:type" content={SEO_CONFIG.openGraph.type} />
      <meta property="og:locale" content={SEO_CONFIG.openGraph.locale} />
      <meta property="og:url" content={SEO_CONFIG.openGraph.url} />
      <meta property="og:site_name" content={SEO_CONFIG.openGraph.siteName} />
      <meta property="og:title" content={SEO_CONFIG.openGraph.title} />
      <meta property="og:description" content={SEO_CONFIG.openGraph.description} />
      <meta property="og:image" content={SEO_CONFIG.openGraph.images[0].url} />
      <meta property="og:image:width" content={SEO_CONFIG.openGraph.images[0].width} />
      <meta property="og:image:height" content={SEO_CONFIG.openGraph.images[0].height} />
      <meta property="og:image:alt" content={SEO_CONFIG.openGraph.images[0].alt} />
      <meta property="og:image:type" content={SEO_CONFIG.openGraph.images[0].type} />
      
      {/* Secondary OG Image */}
      <meta property="og:image" content={SEO_CONFIG.openGraph.images[1].url} />
      <meta property="og:image:width" content={SEO_CONFIG.openGraph.images[1].width} />
      <meta property="og:image:height" content={SEO_CONFIG.openGraph.images[1].height} />
      <meta property="og:image:alt" content={SEO_CONFIG.openGraph.images[1].alt} />
      <meta property="og:image:type" content={SEO_CONFIG.openGraph.images[1].type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={SEO_CONFIG.twitter.cardType} />
      <meta name="twitter:site" content={SEO_CONFIG.twitter.site} />
      <meta name="twitter:creator" content={SEO_CONFIG.twitter.handle} />
      <meta name="twitter:title" content={SEO_CONFIG.openGraph.title} />
      <meta name="twitter:description" content={SEO_CONFIG.openGraph.description} />
      <meta name="twitter:image" content={SEO_CONFIG.openGraph.images[0].url} />
      
      {/* Favicons and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Font Preconnects */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Language Alternates */}
      {SEO_CONFIG.languageAlternates.map((lang, index) => (
        <link key={index} rel="alternate" hrefLang={lang.hrefLang} href={lang.href} />
      ))}
    </Helmet>
  );
};

export default DefaultSEO; 