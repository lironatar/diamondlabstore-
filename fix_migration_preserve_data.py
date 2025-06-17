#!/usr/bin/env python3
"""
Fix migration issues while preserving all existing data
This script will:
1. Check current data in the database
2. Add missing columns safely
3. Fix alembic migration tracking
4. Preserve all existing data
"""

import os
import sys
import sqlite3
from pathlib import Path

def fix_migration():
    print("[INFO] Starting migration fix while preserving data...")
    
    # Change to backend directory
    backend_path = Path(__file__).parent / "backend"
    if not backend_path.exists():
        backend_path = Path(__file__).parent  # Already in backend
    
    os.chdir(backend_path)
    print(f"[INFO] Working in directory: {os.getcwd()}")
    
    # Check if database exists
    db_path = Path("diamondlab.db")
    if not db_path.exists():
        print("[ERROR] Database file 'diamondlab.db' not found!")
        print("[ERROR] Make sure you're running this from the correct directory")
        return False
    
    print(f"[INFO] Found database at: {db_path.absolute()}")
    
    try:
        # Connect to database
        conn = sqlite3.connect('diamondlab.db')
        cursor = conn.cursor()
        
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
            cursor.execute("SELECT name FROM categories LIMIT 5")
            cat_names = [row[0] for row in cursor.fetchall()]
            if cat_names:
                print(f"[INFO] Sample categories: {', '.join(cat_names)}")
            
        except sqlite3.OperationalError as e:
            print(f"[WARNING] Could not read some tables: {e}")
            print("[INFO] This might be normal if new columns were added")
        
        # Check current schema
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
        print("[SUCCESS] All your existing data has been preserved")
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
    print("Diamond Lab Store - Migration Fix Tool")
    print("=" * 40)
    
    success = fix_migration()
    
    if success:
        print("\n✅ Migration fix completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Migration fix failed!")
        print("Please check the error messages above and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main() 