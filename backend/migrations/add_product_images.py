"""Add product_images table

This migration adds support for multiple images per product.
"""

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, text
from sqlalchemy.sql import func

def upgrade(connection):
    """Add product_images table"""
    connection.execute(text("""
        CREATE TABLE product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            image_url VARCHAR NOT NULL,
            alt_text VARCHAR,
            is_primary BOOLEAN DEFAULT FALSE,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE
        )
    """))
    
    connection.execute(text("""
        CREATE INDEX ix_product_images_product_id ON product_images (product_id)
    """))
    
    connection.execute(text("""
        CREATE INDEX ix_product_images_is_primary ON product_images (is_primary)
    """))

def downgrade(connection):
    """Remove product_images table"""
    connection.execute(text("DROP TABLE IF EXISTS product_images"))

if __name__ == "__main__":
    # Auto-run migration when script is executed directly
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    from database import engine
    
    with engine.connect() as connection:
        with connection.begin():
            print("Running migration: Add product_images table...")
            upgrade(connection)
            print("Migration completed successfully!") 