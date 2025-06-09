from database import SessionLocal
from models import Product, Category

db = SessionLocal()

categories = db.query(Category).all()
products = db.query(Product).all()
featured_products = db.query(Product).filter(Product.is_featured == True).all()

print(f"Categories: {len(categories)}")
for cat in categories:
    print(f"  - {cat.name}")

print(f"\nProducts: {len(products)}")
print(f"Featured Products: {len(featured_products)}")

print("\nSample products:")
for product in products[:5]:
    print(f"  - {product.name} - ₪{product.price} - {product.category.name if product.category else 'No Category'}")

db.close() 