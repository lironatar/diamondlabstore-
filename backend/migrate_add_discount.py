#!/usr/bin/env python3

import sqlite3
import os

def migrate_database():
    """Add discount_percentage column to products table if it doesn't exist"""
    
    # Database file path
    db_path = "diamond_store.db"
    
    if not os.path.exists(db_path):
        print("Database file not found. Please run the application first to create the database.")
        return
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if discount_percentage column exists
        cursor.execute("PRAGMA table_info(products)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'discount_percentage' not in columns:
            print("Adding discount_percentage column to products table...")
            
            # Add the discount_percentage column
            cursor.execute("""
                ALTER TABLE products 
                ADD COLUMN discount_percentage REAL DEFAULT 0.0
            """)
            
            print("✅ Successfully added discount_percentage column")
        else:
            print("✅ discount_percentage column already exists")
        
        # Commit changes
        conn.commit()
        
        # Verify the column was added
        cursor.execute("PRAGMA table_info(products)")
        columns = [column[1] for column in cursor.fetchall()]
        print(f"Current columns in products table: {columns}")
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🔄 Running database migration...")
    migrate_database()
    print("✅ Migration completed!") 