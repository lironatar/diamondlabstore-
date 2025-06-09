#!/usr/bin/env python3

import sqlite3
import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from migrations.add_product_variants import upgrade

def main():
    try:
        # Connect to the database
        conn = sqlite3.connect('app.db')
        
        # Run the migration
        upgrade(conn)
        
        # Close the connection
        conn.close()
        
        print("✅ Migration completed successfully!")
        print("Product variants table has been created.")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 