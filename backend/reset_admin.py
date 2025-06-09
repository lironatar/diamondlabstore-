#!/usr/bin/env python3
"""
Reset admin users - useful for testing
Usage: python reset_admin.py
"""

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import models directly
import models
from database import SQLALCHEMY_DATABASE_URL

# Create engine and session
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reset_admins():
    db = SessionLocal()
    try:
        print("=== איפוס מנהלים ===")
        print()
        
        # Get all admin users
        admins = db.query(models.User).filter(models.User.is_admin == True).all()
        
        if not admins:
            print("לא נמצאו מנהלים במערכת")
            return
        
        print("מנהלים קיימים:")
        for admin in admins:
            print(f"- {admin.email} (ID: {admin.id})")
        
        print()
        choice = input("האם למחוק את כל המנהלים? (y/N): ").lower()
        if choice != 'y':
            print("בוטל.")
            return
        
        # Delete all admin users
        count = db.query(models.User).filter(models.User.is_admin == True).delete()
        db.commit()
        
        print(f"✅ נמחקו {count} מנהלים")
        print("כעת תוכל ליצור מנהל חדש עם: python create_simple_admin.py")
        
    except Exception as e:
        print(f"שגיאה: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admins() 