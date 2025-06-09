const SEO_CONFIG = {
  // Basic Site Information
  titleTemplate: '%s | ליבי תכשיטים - יהלומי מעבדה איכותיים',
  defaultTitle: 'ליבי תכשיטים - יהלומי מעבדה איכותיים | תכשיטי יוקרה בישראל',
  description: 'ליבי תכשיטים - החנות המובילה ביהלומי מעבדה איכותיים בישראל. טבעות אירוסין, עגילים, שרשראות ותכשיטי יוקרה. איכות מעולה, מחירים הוגנים, שירות אישי ואחריות מלאה.',
  
  // Language and Location
  languageAlternates: [
    {
      hrefLang: 'he',
      href: 'https://libi-jewelry.com/',
    },
    {
      hrefLang: 'en',
      href: 'https://libi-jewelry.com/en',
    },
    {
      hrefLang: 'x-default',
      href: 'https://libi-jewelry.com/',
    },
  ],

  // Open Graph Configuration
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://libi-jewelry.com/',
    siteName: 'ליבי תכשיטים',
    title: 'ליבי תכשיטים - יהלומי מעבדה איכותיים',
    description: 'החנות המובילה ביהלומי מעבדה איכותיים בישראל. טבעות אירוסין, עגילים, שרשראות ותכשיטי יוקרה במחירים הוגנים.',
    images: [
      {
        url: 'https://libi-jewelry.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ליבי תכשיטים - יהלומי מעבדה איכותיים',
        type: 'image/jpeg',
      },
      {
        url: 'https://libi-jewelry.com/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'ליבי תכשיטים לוגו',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Configuration
  twitter: {
    handle: '@LibiJewelry',
    site: '@LibiJewelry',
    cardType: 'summary_large_image',
  },

  // Additional Meta Tags
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'keywords',
      content: 'יהלומי מעבדה, טבעות אירוסין, תכשיטים, יהלומים, זהב, כסף, עגילים, שרשראות, צמידים, ליבי תכשיטים, תכשיטי יוקרה, יהלומים סינתטיים, lab grown diamonds',
    },
    {
      name: 'author',
      content: 'ליבי תכשיטים',
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {
      name: 'googlebot',
      content: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
    },
    {
      name: 'theme-color',
      content: '#d4af37',
    },
    {
      name: 'msapplication-TileColor',
      content: '#d4af37',
    },
    {
      name: 'application-name',
      content: 'ליבי תכשיטים',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'ליבי תכשיטים',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'format-detection',
      content: 'telephone=yes',
    },
    {
      property: 'business:contact_data:locality',
      content: 'ישראל',
    },
    {
      property: 'business:contact_data:region',
      content: 'מרכז',
    },
    {
      property: 'business:contact_data:country_name',
      content: 'ישראל',
    },
    {
      name: 'geo.region',
      content: 'IL',
    },
    {
      name: 'geo.placename',
      content: 'ישראל',
    },
    {
      name: 'ICBM',
      content: '32.0853, 34.7818', // Tel Aviv coordinates
    },
  ],

  // Additional Link Tags
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
  ],
};

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'דף הבית',
    description: 'ליבי תכשיטים - החנות המובילה ביהלומי מעבדה איכותיים בישראל. טבעות אירוסין יוקרתיות, עגילים, שרשראות ותכשיטי יהלום מעבדה במחירים הוגנים עם תעודות GIA.',
    canonical: 'https://libi-jewelry.com/'
  },
  about: {
    title: 'אודותינו - ליבי תכשיטים | יהלומי מעבדה איכותיים',
    description: 'ליבי תכשיטים - תכשיטים שמכילים יופי וערכים. יהלומי מעבדה איכותיים במחירים הוגנים. בחירה מוסרית ויהלומים אמיתיים עם תעודות GIA ו-IGI.',
    canonical: 'https://libi-jewelry.com/about'
  },
  products: {
    title: 'תכשיטי יהלום מעבדה איכותיים',
    description: 'קולקציית תכשיטי יהלום מעבדה יוקרתיים - טבעות אירוסין, עגילים, שרשראות וצמידים. יהלומים איכותיים עם תעודות GIA במחירים הוגנים.',
    canonical: 'https://libi-jewelry.com/products'
  },
  productDetail: {
    title: 'פרטי מוצר - יהלום מעבדה איכותי',
    description: 'יהלום מעבדה איכותי עם תעודת GIA. צפו בפרטים המלאים, מחיר ומפרט טכני. משלוח חינם בישראל.',
    canonical: 'https://libi-jewelry.com/products/'
  },
  categories: {
    title: 'קטגוריות',
    description: 'גלו את הקטגוריות השונות שלנו - טבעות אירוסין, עגילים, שרשראות, צמידים ותכשיטי יוקרה נוספים. כל המוצרים עשויים מיהלומי מעבדה איכותיים בהתאמה אישית.',
    canonical: 'https://libi-jewelry.com/categories',
  },
  contact: {
    title: 'צור קשר',
    description: 'צרו קשר עם ליבי תכשיטים לייעוץ אישי, הזמנת מוצרים או לכל שאלה. אנו כאן לעזור לכם למצוא את התכשיט המושלם. שירות אישי ומקצועי.',
    canonical: 'https://libi-jewelry.com/contact',
  },
};

export default SEO_CONFIG; 