"""Add product_variants table

This migration adds support for color variants with multiple images per product.
"""

def upgrade(connection):
    """Add product_variants table"""
    connection.execute("""
        CREATE TABLE product_variants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            color_name VARCHAR NOT NULL,
            color_code VARCHAR NOT NULL,
            images JSON,
            is_default BOOLEAN DEFAULT FALSE,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE
        )
    """)
    
    connection.execute("""
        CREATE INDEX ix_product_variants_product_id ON product_variants (product_id)
    """)
    
    connection.execute("""
        CREATE INDEX ix_product_variants_is_default ON product_variants (is_default)
    """)
    
    connection.commit()

def downgrade(connection):
    """Remove product_variants table"""
    connection.execute("DROP TABLE IF EXISTS product_variants")
    connection.commit() 