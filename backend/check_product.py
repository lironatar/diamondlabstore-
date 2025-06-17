from database import SessionLocal
import models

def check_product_1():
    db = SessionLocal()
    try:
        # Get product 1
        product = db.query(models.Product).filter(models.Product.id == 1).first()
        if product:
            print(f"Product 1: {product.name}")
            print(f"Price: ₪{product.price}")
            print(f"Base price: ₪{product.base_price}")
            print(f"Image URL: {product.image_url}")
            print(f"Category ID: {product.category_id}")
            print(f"Available: {product.is_available}")
        else:
            print("Product 1 not found!")
            return
        
        # Check carat availability for product 1
        product_carats = db.query(models.ProductCaratAvailability).filter(
            models.ProductCaratAvailability.product_id == 1
        ).all()
        print(f"\nCarat availability for product 1: {len(product_carats)} records")
        for pc in product_carats:
            print(f"  - {pc.carat_weight} carat (ID: {pc.id}, available: {pc.is_available})")
        
        # Check images for product 1
        images = db.query(models.ProductImage).filter(
            models.ProductImage.product_id == 1
        ).all()
        print(f"\nImages for product 1: {len(images)} records")
        for img in images:
            print(f"  - {img.image_url} (primary: {img.is_primary})")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_product_1() 