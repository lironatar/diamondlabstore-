from database import SessionLocal
import models

def check_carat_data():
    db = SessionLocal()
    try:
        # Check carat pricing table
        carat_pricing = db.query(models.CaratPricing).all()
        print(f"Carat Pricing records: {len(carat_pricing)}")
        for cp in carat_pricing[:5]:  # Show first 5
            print(f"  - {cp.carat_weight} carat: {cp.price_multiplier}x multiplier")
        
        # Check product carat availability
        product_carats = db.query(models.ProductCaratAvailability).all()
        print(f"\nProduct Carat Availability records: {len(product_carats)}")
        for pc in product_carats[:10]:  # Show first 10
            print(f"  - Product {pc.product_id}: {pc.carat_weight} carat (available: {pc.is_available})")
        
        # Check specific product 2
        product_2_carats = db.query(models.ProductCaratAvailability).filter(
            models.ProductCaratAvailability.product_id == 2
        ).all()
        print(f"\nProduct 2 carat availability: {len(product_2_carats)} records")
        for pc in product_2_carats:
            print(f"  - {pc.carat_weight} carat (ID: {pc.id}, available: {pc.is_available})")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_carat_data() 