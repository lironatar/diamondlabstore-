#!/usr/bin/env python3
"""
Fix migration issues while preserving all existing data
This script will:
1. Check if database tables exist
2. Create tables if they don't exist
3. Add missing columns safely
4. Fix alembic migration tracking
5. Preserve all existing data
"""

import os
import sys
import sqlite3
from pathlib import Path

def create_tables_if_not_exist(cursor, conn):
    """Create basic table structure if it doesn't exist"""
    print("[INFO] Checking/creating basic table structure...")
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create categories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            image_url VARCHAR(255),
            hero_image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(200) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            category_id INTEGER,
            image_url VARCHAR(255),
            carat_weight DECIMAL(5, 2),
            color_grade VARCHAR(10),
            clarity_grade VARCHAR(10),
            cut_grade VARCHAR(20),
            certification VARCHAR(50),
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )
    ''')
    
    # Create product_images table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            is_primary BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        )
    ''')
    
    # Create product_variants table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_variants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            name VARCHAR(100) NOT NULL,
            price_modifier DECIMAL(10, 2) DEFAULT 0,
            is_default BOOLEAN DEFAULT FALSE,
            images TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        )
    ''')
    
    # Create alembic_version table for migration tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alembic_version (
            version_num VARCHAR(32) NOT NULL,
            CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
        )
    ''')
    
    conn.commit()
    print("[SUCCESS] Basic table structure created/verified")

def add_sample_data_if_empty(cursor, conn):
    """Add sample data if tables are empty"""
    print("[INFO] Checking if sample data is needed...")
    
    # Check if categories table is empty
    cursor.execute("SELECT COUNT(*) FROM categories")
    cat_count = cursor.fetchone()[0]
    
    if cat_count == 0:
        print("[INFO] Adding sample categories...")
        categories = [
            ("טבעות אירוסין", "טבעות אירוסין יוקרתיות עם יהלומים מעולים"),
            ("עגילים", "עגילי יהלומים מעוצבים בסגנונות שונים"),
            ("שרשרות", "שרשרות יהלומים אלגנטיות"),
            ("צמידים", "צמידי יהלומים יוקרתיים"),
            ("טבעות נישואין", "טבעות נישואין קלאסיות ומודרניות"),
            ("סטים", "סטים מתואמים של תכשיטי יהלומים")
        ]
        
        for name, desc in categories:
            cursor.execute(
                "INSERT INTO categories (name, description) VALUES (?, ?)",
                (name, desc)
            )
        
        conn.commit()
        print(f"[SUCCESS] Added {len(categories)} sample categories")
    else:
        print(f"[INFO] Found {cat_count} existing categories")

def fix_migration():
    print("[INFO] Starting migration fix while preserving data...")
    
    # Change to backend directory
    backend_path = Path(__file__).parent / "backend"
    if not backend_path.exists():
        backend_path = Path(__file__).parent  # Already in backend
    
    os.chdir(backend_path)
    print(f"[INFO] Working in directory: {os.getcwd()}")
    
    # Check if database exists, create if not
    db_path = Path("diamondlab.db")
    if not db_path.exists():
        print("[INFO] Database file 'diamondlab.db' not found, will create it")
    else:
        print(f"[INFO] Found database at: {db_path.absolute()}")
    
    try:
        # Connect to database (will create if doesn't exist)
        conn = sqlite3.connect('diamondlab.db')
        cursor = conn.cursor()
        
        # Create tables if they don't exist
        create_tables_if_not_exist(cursor, conn)
        
        # Check current data
        print("[INFO] Checking current data...")
        
        try:
            cursor.execute("SELECT COUNT(*) FROM categories")
            cat_count = cursor.fetchone()[0]
            print(f"[INFO] Found {cat_count} categories in database")
            
            cursor.execute("SELECT COUNT(*) FROM products")
            prod_count = cursor.fetchone()[0]
            print(f"[INFO] Found {prod_count} products in database")
            
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            print(f"[INFO] Found {user_count} users in database")
            
            # Show sample category names
            if cat_count > 0:
                cursor.execute("SELECT name FROM categories LIMIT 5")
                cat_names = [row[0] for row in cursor.fetchall()]
                print(f"[INFO] Sample categories: {', '.join(cat_names)}")
            
        except sqlite3.OperationalError as e:
            print(f"[WARNING] Could not read some tables: {e}")
            print("[INFO] This might be normal if new columns were added")
        
        # Add sample data if database is empty
        add_sample_data_if_empty(cursor, conn)
        
        # Check current schema and add missing columns
        print("[INFO] Checking categories table schema...")
        cursor.execute("PRAGMA table_info(categories)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        print(f"[INFO] Current columns in categories table: {', '.join(column_names)}")
        
        # Add missing hero_image_url column if needed
        if 'hero_image_url' not in column_names:
            print("[INFO] Adding missing 'hero_image_url' column to categories table...")
            cursor.execute("ALTER TABLE categories ADD COLUMN hero_image_url TEXT")
            conn.commit()
            print("[SUCCESS] Added 'hero_image_url' column successfully")
        else:
            print("[INFO] 'hero_image_url' column already exists")
        
        # Check for other missing columns and add them
        expected_columns = {
            'products': ['is_featured'],
            'categories': ['hero_image_url']
        }
        
        for table, expected_cols in expected_columns.items():
            cursor.execute(f"PRAGMA table_info({table})")
            existing_columns = [col[1] for col in cursor.fetchall()]
            
            for col in expected_cols:
                if col not in existing_columns:
                    if table == 'products' and col == 'is_featured':
                        print(f"[INFO] Adding missing '{col}' column to {table} table...")
                        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col} BOOLEAN DEFAULT FALSE")
                        conn.commit()
                        print(f"[SUCCESS] Added '{col}' column to {table} table")
        
        # Close database connection
        conn.close()
        print("[INFO] Database changes completed")
        
        # Fix alembic migration tracking
        print("[INFO] Fixing alembic migration tracking...")
        
        # Check if alembic.ini exists
        if not Path("alembic.ini").exists():
            print("[WARNING] alembic.ini not found, skipping alembic fix")
        else:
            # Reset alembic to match current database state
            result = os.system("alembic stamp head")
            if result == 0:
                print("[SUCCESS] Alembic tracking reset to current state")
            else:
                print("[WARNING] Alembic command had issues, but database changes were successful")
        
        print("\n" + "="*60)
        print("[SUCCESS] Migration fix completed successfully!")
        print("[SUCCESS] Database is now properly initialized and ready to use")
        print("="*60)
        print("\n[INFO] You can now start the application with:")
        print("  python main.py")
        print("\nOr run the full setup script:")
        print("  ./setup-linux-ip-only.sh")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Migration fix failed: {e}")
        import traceback
        print("[ERROR] Full error details:")
        traceback.print_exc()
        return False

def main():
    """Main function to run the migration fix"""
    print("Diamond Lab Store - Database Initialization & Migration Fix Tool")
    print("=" * 65)
    
    success = fix_migration()
    
    if success:
        print("\n✅ Database initialization and migration fix completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Migration fix failed!")
        print("Please check the error messages above and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main() 