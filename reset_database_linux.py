#!/usr/bin/env python3
"""
Complete database reset script for Linux server
Run this script to completely reset the database and migrations
"""

import os
import sys
import sqlite3
from pathlib import Path

def reset_database():
    print("[INFO] Starting complete database reset...")
    
    # Add backend to path
    backend_path = Path(__file__).parent / "backend"
    sys.path.append(str(backend_path))
    
    # Change to backend directory
    os.chdir(backend_path)
    
    # Remove existing database
    db_path = Path("diamondlab.db")
    if db_path.exists():
        print("[INFO] Removing existing database...")
        db_path.unlink()
    
    # Remove alembic version tracking
    alembic_version_path = Path("alembic") / "versions" / "__pycache__"
    if alembic_version_path.exists():
        print("[INFO] Cleaning alembic cache...")
        import shutil
        shutil.rmtree(alembic_version_path)
    
    try:
        # Import database components
        from database import engine, Base
        import models
        
        print("[INFO] Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        print("[INFO] Database tables created successfully")
        
        # Mark alembic as up to date
        os.system("alembic stamp head")
        print("[INFO] Alembic tracking initialized")
        
        # Create admin user
        print("[INFO] Creating admin user...")
        os.system("python create_admin.py")
        
        # Add sample categories if they don't exist
        from database import SessionLocal
        from models import Category
        
        db = SessionLocal()
        try:
            existing_categories = db.query(Category).count()
            if existing_categories == 0:
                print("[INFO] Adding sample categories...")
                categories = [
                    Category(name="טבעות אירוסין", description="טבעות אירוסין יוקרתיות"),
                    Category(name="עגילים", description="עגילים מעוצבים"),
                    Category(name="שרשרות", description="שרשרות יהלומים"),
                    Category(name="צמידים", description="צמידים אלגנטיים"),
                    Category(name="טבעות נישואין", description="טבעות נישואין קלאסיות"),
                    Category(name="סטים", description="סטים מתואמים")
                ]
                
                for category in categories:
                    db.add(category)
                db.commit()
                print(f"[INFO] Added {len(categories)} categories")
            else:
                print(f"[INFO] Found {existing_categories} existing categories")
        finally:
            db.close()
        
        print("\n[SUCCESS] Database reset completed successfully!")
        print("You can now start the application with:")
        print("cd backend && python main.py")
        
    except Exception as e:
        print(f"[ERROR] Failed to reset database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = reset_database()
    sys.exit(0 if success else 1) 