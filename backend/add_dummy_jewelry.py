#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Product, Category, Base
import json

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

def add_categories(db: Session):
    """Add jewelry categories"""
    categories_data = [
        {
            "name": "טבעות אירוסין",
            "description": "טבעות אירוסין מעוצבות עם יהלומי מעבדה איכותיים",
            "image_url": "/images/categories/engagement-rings.jpg"
        },
        {
            "name": "עגילים",
            "description": "עגילי יהלום מעבדה בעיצובים מגוונים",
            "image_url": "/images/categories/earrings.jpg"
        },
        {
            "name": "שרשראות",
            "description": "שרשראות יהלום מעבדה אלגנטיות",
            "image_url": "/images/categories/necklaces.jpg"
        },
        {
            "name": "צמידים",
            "description": "צמידי יהלום מעבדה מדהימים",
            "image_url": "/images/categories/bracelets.jpg"
        },
        {
            "name": "טבעות נישואין",
            "description": "טבעות נישואין קלאסיות ומודרניות",
            "image_url": "/images/categories/wedding-rings.jpg"
        },
        {
            "name": "סטים",
            "description": "סטים משלימים של תכשיטי יהלום מעבדה",
            "image_url": "/images/categories/sets.jpg"
        }
    ]
    
    created_categories = []
    for cat_data in categories_data:
        # Check if category already exists
        existing_cat = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing_cat:
            category = Category(**cat_data)
            db.add(category)
            created_categories.append(category)
        else:
            created_categories.append(existing_cat)
    
    db.commit()
    
    # Refresh to get IDs
    for cat in created_categories:
        db.refresh(cat)
    
    return created_categories

def add_products(db: Session, categories):
    """Add jewelry products"""
    
    # Create a mapping of category names to objects
    cat_map = {cat.name: cat for cat in categories}
    
    products_data = [
        # טבעות אירוסין
        {
            "name": "טבעת אירוסין סוליטר קלאסית",
            "description": "טבעת אירוסין קלאסית עם יהלום מעבדה מרכזי בליטוש עגול מושלם. עיצוב אלגנטי ונצחי המתאים לכל סגנון.",
            "price": 8500.0,
            "carat_weight": 1.5,
            "color_grade": "D",
            "clarity_grade": "VVS1",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-001-2024",
            "is_featured": True,
            "category_id": cat_map["טבעות אירוסין"].id,
            "image_url": "/images/products/engagement-ring-1.jpg"
        },
        {
            "name": "טבעת אירוסין הילו מרהיבה",
            "description": "טבעת אירוסין מעוצבת עם יהלום מרכזי מוקף ביהלומים קטנים יותר. יוצרת ברק מדהים ומראה גרנדיוזי.",
            "price": 12500.0,
            "carat_weight": 2.0,
            "color_grade": "E",
            "clarity_grade": "VVS2",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-002-2024",
            "is_featured": True,
            "category_id": cat_map["טבעות אירוסין"].id,
            "image_url": "/images/products/engagement-ring-2.jpg"
        },
        {
            "name": "טבעת אירוסין פרינסס יוקרתית",
            "description": "טבעת אירוסין מודרנית עם יהלום מעבדה בליטוש פרינסס (ריבועי). עיצוב עכשווי ומתוחכם.",
            "price": 9200.0,
            "carat_weight": 1.3,
            "color_grade": "F",
            "clarity_grade": "VS1",
            "cut_grade": "Very Good",
            "shape": "Princess",
            "certificate_number": "LAB-003-2024",
            "is_featured": False,
            "category_id": cat_map["טבעות אירוסין"].id,
            "image_url": "/images/products/engagement-ring-3.jpg"
        },
        {
            "name": "טבעת אירוסין וינטג' רומנטית",
            "description": "טבעת אירוסין בסגנון וינטג' עם פרטים מעוטרים ויהלום מעבדה מרכזי. מושלמת לאוהבות הסגנון הקלאסי.",
            "price": 7800.0,
            "carat_weight": 1.2,
            "color_grade": "G",
            "clarity_grade": "VS2",
            "cut_grade": "Very Good",
            "shape": "Round",
            "certificate_number": "LAB-004-2024",
            "is_featured": False,
            "category_id": cat_map["טבעות אירוסין"].id,
            "image_url": "/images/products/engagement-ring-4.jpg"
        },

        # עגילים
        {
            "name": "עגילי יהלום סטאד קלאסיים",
            "description": "עגילי יהלום מעבדה קלאסיים בעיצוב סטאד. מושלמים לכל יום ולכל אירוע מיוחד.",
            "price": 3200.0,
            "carat_weight": 0.8,
            "color_grade": "D",
            "clarity_grade": "VVS1",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-005-2024",
            "is_featured": True,
            "category_id": cat_map["עגילים"].id,
            "image_url": "/images/products/earrings-1.jpg"
        },
        {
            "name": "עגילי יהלום תלויים אלגנטיים",
            "description": "עגילים תלויים מעוצבים עם יהלומי מעבדה מדרגים. יוצרים תנועה יפהפייה ומראה חגיגי.",
            "price": 5500.0,
            "carat_weight": 1.2,
            "color_grade": "E",
            "clarity_grade": "VVS2",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-006-2024",
            "is_featured": True,
            "category_id": cat_map["עגילים"].id,
            "image_url": "/images/products/earrings-2.jpg"
        },
        {
            "name": "עגילי יהלום חישוק מודרניים",
            "description": "עגילי חישוק עכשוויים עם יהלומי מעבדה לאורך כל ההיקף. מתאימים לשימוש יומיומי ולאירועים.",
            "price": 4200.0,
            "carat_weight": 1.0,
            "color_grade": "F",
            "clarity_grade": "VS1",
            "cut_grade": "Very Good",
            "shape": "Round",
            "certificate_number": "LAB-007-2024",
            "is_featured": False,
            "category_id": cat_map["עגילים"].id,
            "image_url": "/images/products/earrings-3.jpg"
        },

        # שרשראות
        {
            "name": "שרשרת יהלום סוליטר עדינה",
            "description": "שרשרת זהב לבן עדינה עם יהלום מעבדה יחיד. פשוטה, אלגנטית ומושלמת לכל יום.",
            "price": 2800.0,
            "carat_weight": 0.5,
            "color_grade": "D",
            "clarity_grade": "VVS1",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-008-2024",
            "is_featured": True,
            "category_id": cat_map["שרשראות"].id,
            "image_url": "/images/products/necklace-1.jpg"
        },
        {
            "name": "שרשרת יהלום טניס יוקרתית",
            "description": "שרשרת טניס קלאסית עם יהלומי מעבדה איכותיים לאורך כל השרשרת. יוקרה ואלגנטיות ללא פשרות.",
            "price": 15500.0,
            "carat_weight": 5.0,
            "color_grade": "E",
            "clarity_grade": "VVS2",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-009-2024",
            "is_featured": True,
            "category_id": cat_map["שרשראות"].id,
            "image_url": "/images/products/necklace-2.jpg"
        },
        {
            "name": "שרשרת יהלום בעיצוב לב",
            "description": "שרשרת רומנטית עם תליון בצורת לב משובץ יהלומי מעבדה. מתנה מושלמת לאהובה.",
            "price": 3500.0,
            "carat_weight": 0.7,
            "color_grade": "F",
            "clarity_grade": "VS1",
            "cut_grade": "Very Good",
            "shape": "Round",
            "certificate_number": "LAB-010-2024",
            "is_featured": False,
            "category_id": cat_map["שרשראות"].id,
            "image_url": "/images/products/necklace-3.jpg"
        },

        # צמידים
        {
            "name": "צמיד יהלום טניס קלאסי",
            "description": "צמיד טניס יוקרתי עם יהלומי מעבדה איכותיים. עיצוב נצחי שמתאים לכל אירוע מיוחד.",
            "price": 8900.0,
            "carat_weight": 3.0,
            "color_grade": "D",
            "clarity_grade": "VVS1",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-011-2024",
            "is_featured": True,
            "category_id": cat_map["צמידים"].id,
            "image_url": "/images/products/bracelet-1.jpg"
        },
        {
            "name": "צמיד יהלום עדין יומיומי",
            "description": "צמיד עדין ומעוצב עם יהלומי מעבדה קטנים. מושלם לשימוש יומיומי ולשילוב עם תכשיטים נוספים.",
            "price": 4200.0,
            "carat_weight": 1.5,
            "color_grade": "E",
            "clarity_grade": "VVS2",
            "cut_grade": "Very Good",
            "shape": "Round",
            "certificate_number": "LAB-012-2024",
            "is_featured": False,
            "category_id": cat_map["צמידים"].id,
            "image_url": "/images/products/bracelet-2.jpg"
        },

        # טבעות נישואין
        {
            "name": "טבעת נישואין קלאסית גברים",
            "description": "טבעת נישואין קלאסית לגברים מזהב לבן עם פס יהלומים. עיצוב גברי ואלגנטי.",
            "price": 5200.0,
            "carat_weight": 0.8,
            "color_grade": "G",
            "clarity_grade": "VS1",
            "cut_grade": "Very Good",
            "shape": "Round",
            "certificate_number": "LAB-013-2024",
            "is_featured": False,
            "category_id": cat_map["טבעות נישואין"].id,
            "image_url": "/images/products/wedding-ring-1.jpg"
        },
        {
            "name": "טבעת נישואין נשים משובצת",
            "description": "טבעת נישואין לנשים עם יהלומי מעבדה לאורך כל ההיקף. רומנטית ומנצנצת.",
            "price": 6800.0,
            "carat_weight": 1.2,
            "color_grade": "F",
            "clarity_grade": "VS2",
            "cut_grade": "Very Good",
            "shape": "Round",
            "certificate_number": "LAB-014-2024",
            "is_featured": True,
            "category_id": cat_map["טבעות נישואין"].id,
            "image_url": "/images/products/wedding-ring-2.jpg"
        },

        # סטים
        {
            "name": "סט תכשיטים מושלם - עגילים ושרשרת",
            "description": "סט מעוצב המכיל עגילים ושרשרת תואמים עם יהלומי מעבדה. מושלם למתנה או לאירועים מיוחדים.",
            "price": 7500.0,
            "carat_weight": 2.0,
            "color_grade": "E",
            "clarity_grade": "VVS2",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-015-2024",
            "is_featured": True,
            "category_id": cat_map["סטים"].id,
            "image_url": "/images/products/set-1.jpg"
        },
        {
            "name": "סט כלה מלא - טבעת, עגילים ושרשרת",
            "description": "סט כלה מושלם הכולל טבעת אירוסין, עגילים ושרשרת תואמים. הבחירה המושלמת ליום החתונה.",
            "price": 18500.0,
            "carat_weight": 4.5,
            "color_grade": "D",
            "clarity_grade": "VVS1",
            "cut_grade": "Excellent",
            "shape": "Round",
            "certificate_number": "LAB-016-2024",
            "is_featured": True,
            "category_id": cat_map["סטים"].id,
            "image_url": "/images/products/set-2.jpg"
        }
    ]
    
    for product_data in products_data:
        # Check if product already exists
        existing_product = db.query(Product).filter(Product.name == product_data["name"]).first()
        if not existing_product:
            product = Product(**product_data)
            db.add(product)
    
    db.commit()
    print(f"Added {len(products_data)} products to the database!")

def main():
    """Main function to populate the database"""
    db = get_db()
    
    try:
        print("Adding categories...")
        categories = add_categories(db)
        print(f"Added {len(categories)} categories!")
        
        print("Adding products...")
        add_products(db, categories)
        print("Database populated successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main() 