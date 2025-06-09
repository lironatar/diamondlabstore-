#!/usr/bin/env python3
"""
Script to create an admin user for the Diamond Lab Store
Usage: python create_admin.py
"""

import sys
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from auth import get_password_hash

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(models.User).filter(models.User.is_admin == True).first()
        if existing_admin:
            print(f"מנהל כבר קיים במערכת: {existing_admin.email}")
            choice = input("האם ברצונך ליצור מנהל נוסף? (y/N): ").lower()
            if choice != 'y':
                print("יצירת מנהל בוטלה.")
                return

        print("=== יצירת משתמש מנהל ===")
        print()
        
        # Get admin details
        email = input("מייל של המנהל: ").strip()
        if not email:
            print("שגיאה: מייל הוא שדה חובה")
            return
            
        # Check if email already exists
        existing_user = db.query(models.User).filter(models.User.email == email).first()
        if existing_user:
            print(f"שגיאה: משתמש עם המייל {email} כבר קיים")
            return
            
        username = input("שם משתמש: ").strip()
        if not username:
            print("שגיאה: שם משתמש הוא שדה חובה")
            return
            
        # Check if username already exists
        existing_username = db.query(models.User).filter(models.User.username == username).first()
        if existing_username:
            print(f"שגיאה: שם המשתמש {username} כבר קיים")
            return
            
        full_name = input("שם מלא: ").strip()
        if not full_name:
            print("שגיאה: שם מלא הוא שדה חובה")
            return
            
        phone = input("טלפון (אופציונלי): ").strip() or None
        
        # Get password
        import getpass
        password = getpass.getpass("סיסמה: ")
        if len(password) < 6:
            print("שגיאה: הסיסמה חייבת להכיל לפחות 6 תווים")
            return
            
        password_confirm = getpass.getpass("אישור סיסמה: ")
        if password != password_confirm:
            print("שגיאה: הסיסמאות אינן תואמות")
            return
        
        # Create admin user
        hashed_password = get_password_hash(password)
        admin_user = models.User(
            email=email,
            username=username,
            full_name=full_name,
            phone=phone,
            hashed_password=hashed_password,
            is_admin=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print()
        print("✅ משתמש מנהל נוצר בהצלחה!")
        print(f"מייל: {admin_user.email}")
        print(f"שם משתמש: {admin_user.username}")
        print(f"שם מלא: {admin_user.full_name}")
        print(f"ID: {admin_user.id}")
        print()
        print("כעת תוכל להתחבר לפאנל הניהול בכתובת: http://localhost:3001/admin")
        
    except Exception as e:
        print(f"שגיאה ביצירת המנהל: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user() 