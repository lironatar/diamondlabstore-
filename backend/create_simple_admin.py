#!/usr/bin/env python3
"""
Simple admin user creation script - Email and Password only
Usage: python create_simple_admin.py
"""

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import hashlib
import secrets
from decouple import config

# Import models directly
import models
from database import SQLALCHEMY_DATABASE_URL

# Create engine and session
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def simple_hash_password(password):
    """Simple password hashing using bcrypt alternative"""
    try:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
        return pwd_context.hash(password)
    except Exception:
        # Fallback to simple hash (not recommended for production)
        salt = secrets.token_hex(16)
        return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex() + ":" + salt

def create_simple_admin():
    db = SessionLocal()
    try:
        print("=== יצירת מנהל פשוט ===")
        print()
        
        # Check if any admin exists
        existing_admin = db.query(models.User).filter(models.User.is_admin == True).first()
        if existing_admin:
            print(f"מנהל כבר קיים: {existing_admin.email}")
            choice = input("האם ליצור מנהל נוסף? (y/N): ").lower()
            if choice != 'y':
                print("בוטל.")
                return

        # Get admin details  
        email = input("מייל: ").strip()
        if not email or '@' not in email:
            print("שגיאה: מייל לא תקין")
            return
            
        # Check if email exists
        if db.query(models.User).filter(models.User.email == email).first():
            print(f"שגיאה: המייל {email} כבר קיים")
            return
        
        # Get password
        import getpass
        password = getpass.getpass("סיסמה: ")
        if len(password) < 4:
            print("שגיאה: סיסמה חייבת להיות לפחות 4 תווים")
            return
            
        confirm = getpass.getpass("אישור סיסמה: ")
        if password != confirm:
            print("שגיאה: הסיסמאות לא תואמות")
            return
        
        # Generate username from email
        username = email.split('@')[0]
        counter = 1
        original_username = username
        while db.query(models.User).filter(models.User.username == username).first():
            username = f"{original_username}{counter}"
            counter += 1
        
        # Create admin
        hashed_password = simple_hash_password(password)
        admin_user = models.User(
            email=email,
            username=username,
            full_name="מנהל מערכת",  # Default admin name
            hashed_password=hashed_password,
            is_admin=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print()
        print("✅ מנהל נוצר בהצלחה!")
        print(f"מייל: {admin_user.email}")
        print(f"שם משתמש: {admin_user.username}")
        print(f"ID: {admin_user.id}")
        print()
        print("היכנס לאתר: http://localhost:3001/login")
        
    except Exception as e:
        print(f"שגיאה: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_simple_admin() 