#!/usr/bin/env python3
"""
Quick database fix for Linux server migration issues
Run this directly on the Linux server to fix the database without setup script
"""

import os
import sys
import sqlite3
from pathlib import Path

def main():
    print("🔧 Quick Database Fix for Linux Server")
    print("=====================================")
    
    # Change to backend directory
    if os.path.exists('backend'):
        os.chdir('backend')
        print("✅ Changed to backend directory")
    else:
        print("❌ Backend directory not found. Make sure you're in the project root.")
        sys.exit(1)
    
    # Database file path
    db_file = "diamond_store.db"
    
    try:
        # Connect to database
        print(f"🔗 Connecting to database: {db_file}")
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Check if tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        existing_tables = [row[0] for row in cursor.fetchall()]
        print(f"📋 Existing tables: {existing_tables}")
        
        if not existing_tables:
            print("🆕 No tables found. Creating complete database structure...")
            create_complete_database(cursor)
        else:
            print("🔄 Tables exist. Checking for missing columns...")
            fix_existing_database(cursor)
        
        # Commit changes
        conn.commit()
        print("✅ Database changes committed")
        
        # Fix alembic version tracking
        print("🏷️  Fixing alembic version tracking...")
        cursor.execute("DELETE FROM alembic_version")
        cursor.execute("INSERT INTO alembic_version (version_num) VALUES ('head')")
        conn.commit()
        
        conn.close()
        print("✅ Database connection closed")
        
        # Reset alembic tracking
        print("🔄 Resetting alembic tracking...")
        os.system("alembic stamp head")
        
        print("\n🎉 Database fix completed successfully!")
        print("You can now run the backend server.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Let's try a complete database reset...")
        try:
            conn.close()
        except:
            pass
        
        # Backup and recreate
        if os.path.exists(db_file):
            backup_name = f"{db_file}.backup"
            os.rename(db_file, backup_name)
            print(f"📦 Backed up database to {backup_name}")
        
        # Create fresh database
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        create_complete_database(cursor)
        conn.commit()
        conn.close()
        
        # Reset alembic
        os.system("alembic stamp head")
        print("✅ Fresh database created successfully!")

def create_complete_database(cursor):
    """Create complete database structure"""
    
    # Users table
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            hashed_password VARCHAR(255) NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            is_admin BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Categories table with hero_image_url
    cursor.execute('''
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            image_url VARCHAR(500),
            hero_image_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Products table
    cursor.execute('''
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            category_id INTEGER,
            stock_quantity INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )
    ''')
    
    # Product images table
    cursor.execute('''
        CREATE TABLE product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            is_primary BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    # Product variants table
    cursor.execute('''
        CREATE TABLE product_variants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            carat DECIMAL(4,2),
            color VARCHAR(10),
            clarity VARCHAR(10),
            cut VARCHAR(50),
            price DECIMAL(10,2),
            stock_quantity INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    # Alembic version table
    cursor.execute('''
        CREATE TABLE alembic_version (
            version_num VARCHAR(32) PRIMARY KEY
        )
    ''')
    
    # Insert Hebrew sample categories
    categories = [
        ("טבעות אירוסין", "טבעות אירוסין יוקרתיות עם יהלומי מעבדה", "/images/engagement-rings.jpg", "/images/hero-engagement.jpg"),
        ("עגילים", "עגילי יהלום מעוצבים ויוקרתיים", "/images/earrings.jpg", "/images/hero-earrings.jpg"),
        ("שרשראות", "שרשראות יהלום אלגנטיות", "/images/necklaces.jpg", "/images/hero-necklaces.jpg"),
        ("צמידים", "צמידי יהלום מרהיבים", "/images/bracelets.jpg", "/images/hero-bracelets.jpg")
    ]
    
    cursor.executemany('''
        INSERT INTO categories (name, description, image_url, hero_image_url)
        VALUES (?, ?, ?, ?)
    ''', categories)
    
    print("✅ Complete database structure created with Hebrew categories")

def fix_existing_database(cursor):
    """Fix existing database by adding missing columns"""
    
    try:
        # Check if hero_image_url column exists in categories
        cursor.execute("PRAGMA table_info(categories)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'hero_image_url' not in columns:
            print("🔧 Adding hero_image_url column to categories table...")
            cursor.execute("ALTER TABLE categories ADD COLUMN hero_image_url VARCHAR(500)")
            print("✅ Added hero_image_url column")
        else:
            print("✅ hero_image_url column already exists")
            
    except Exception as e:
        print(f"⚠️  Error checking/adding columns: {e}")

if __name__ == "__main__":
    main() 