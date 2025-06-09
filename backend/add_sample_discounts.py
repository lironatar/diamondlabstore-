#!/usr/bin/env python3

import sqlite3
import random
import os

def add_sample_discounts():
    """Add discount percentages to some existing products"""
    
    # Database file path
    db_path = "diamond_store.db"
    
    if not os.path.exists(db_path):
        print("Database file not found. Please run the application first to create the database.")
        return
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all products
        cursor.execute("SELECT id, name, price FROM products")
        products = cursor.fetchall()
        
        if not products:
            print("No products found in database.")
            return
        
        print(f"Found {len(products)} products. Adding discounts to some of them...")
        
        # Add discounts to random products (about 40% of them)
        discount_count = 0
        for product_id, name, price in products:
            # 40% chance to add discount
            if random.random() < 0.4:
                # Random discount between 5% and 30%
                discount = round(random.uniform(5, 30), 1)
                
                cursor.execute("""
                    UPDATE products 
                    SET discount_percentage = ? 
                    WHERE id = ?
                """, (discount, product_id))
                
                print(f"✅ Added {discount}% discount to '{name}' (₪{price:,.0f})")
                discount_count += 1
        
        # Commit changes
        conn.commit()
        
        print(f"\n🎉 Successfully added discounts to {discount_count} products!")
        
        # Show discounted products
        cursor.execute("""
            SELECT name, price, discount_percentage 
            FROM products 
            WHERE discount_percentage > 0 
            ORDER BY discount_percentage DESC
        """)
        
        discounted_products = cursor.fetchall()
        print(f"\n📋 Discounted products ({len(discounted_products)}):")
        for name, price, discount in discounted_products:
            discounted_price = price * (1 - discount / 100)
            print(f"  • {name}: ₪{price:,.0f} → ₪{discounted_price:,.0f} (-{discount}%)")
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🔄 Adding sample discounts to products...")
    add_sample_discounts()
    print("✅ Sample discounts added!") 