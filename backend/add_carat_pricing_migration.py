"""
Add carat pricing and product carat availability tables
"""
import sqlite3
import sys
import os

def run_migration():
    try:
        # Connect to the database
        conn = sqlite3.connect('diamond_store.db')
        cursor = conn.cursor()
        
        print("Starting carat pricing migration...")
        
        # Create carat_pricing table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS carat_pricing (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                carat_weight REAL NOT NULL UNIQUE,
                price_multiplier REAL NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create product_carat_availability table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS product_carat_availability (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                carat_weight REAL NOT NULL,
                is_available BOOLEAN DEFAULT 1,
                is_default BOOLEAN DEFAULT 0,
                sort_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
            )
        ''')
        
        # Add base_price column to products table if it doesn't exist
        try:
            cursor.execute('ALTER TABLE products ADD COLUMN base_price REAL')
            print("Added base_price column to products table")
            
            # Copy current price to base_price for existing products
            cursor.execute('UPDATE products SET base_price = price WHERE base_price IS NULL')
            
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("base_price column already exists")
            else:
                raise e
        
        # Insert default carat pricing data
        default_carat_data = [
            (0.5, 0.7),   # 0.5 carat = 70% of base price
            (0.75, 0.85), # 0.75 carat = 85% of base price
            (1.0, 1.0),   # 1 carat = 100% of base price (baseline)
            (1.25, 1.2),  # 1.25 carat = 120% of base price
            (1.5, 1.45),  # 1.5 carat = 145% of base price
            (1.75, 1.7),  # 1.75 carat = 170% of base price
            (2.0, 2.0),   # 2 carat = 200% of base price
            (2.5, 2.5),   # 2.5 carat = 250% of base price
            (3.0, 3.2),   # 3 carat = 320% of base price
        ]
        
        cursor.execute('DELETE FROM carat_pricing')  # Clear existing data
        cursor.executemany(
            'INSERT INTO carat_pricing (carat_weight, price_multiplier) VALUES (?, ?)',
            default_carat_data
        )
        
        # Add default carat availability for existing products
        cursor.execute('SELECT id FROM products')
        product_ids = [row[0] for row in cursor.fetchall()]
        
        # Default available carats for all products (1.0 as default)
        default_product_carats = [
            (0.5, False, 1),
            (0.75, False, 2),
            (1.0, True, 3),  # Default selection
            (1.25, False, 4),
            (1.5, False, 5),
            (2.0, False, 6),
        ]
        
        for product_id in product_ids:
            for carat_weight, is_default, sort_order in default_product_carats:
                cursor.execute('''
                    INSERT OR IGNORE INTO product_carat_availability 
                    (product_id, carat_weight, is_default, sort_order) 
                    VALUES (?, ?, ?, ?)
                ''', (product_id, carat_weight, is_default, sort_order))
        
        conn.commit()
        print("Migration completed successfully!")
        print(f"- Created carat_pricing table with {len(default_carat_data)} default entries")
        print(f"- Created product_carat_availability table")
        print(f"- Added default carat options for {len(product_ids)} products")
        print("- Added base_price column to products table")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
        return False
    finally:
        if conn:
            conn.close()
    
    return True

if __name__ == "__main__":
    if run_migration():
        print("✅ Carat pricing migration completed successfully!")
        sys.exit(0)
    else:
        print("❌ Migration failed!")
        sys.exit(1) 