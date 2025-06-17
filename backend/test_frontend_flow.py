import requests
import json

def test_frontend_flow():
    """Test the complete flow that the frontend should follow"""
    base_url = "http://localhost:8001"
    
    print("=== Testing Frontend Flow for Product 2 ===\n")
    
    # Step 1: Fetch product data (what ProductDetailSlider.js does)
    print("1. Fetching product data...")
    try:
        response = requests.get(f"{base_url}/api/products/2")
        if response.status_code == 200:
            product = response.json()
            print(f"✅ Product loaded: {product['name']}")
            print(f"   Base price: ₪{product['price']}")
            print(f"   Available carats: {len(product.get('available_carats', []))}")
            
            # Show available carats
            carats = product.get('available_carats', [])
            if carats:
                print("   Carat options:")
                for carat in carats[:5]:  # Show first 5
                    print(f"     - {carat['carat_weight']} carat (ID: {carat['id']})")
                
                # Step 2: Test price calculation for first carat
                print(f"\n2. Testing price calculation for {carats[0]['carat_weight']} carat...")
                price_response = requests.get(f"{base_url}/api/products/2/price/{carats[0]['carat_weight']}")
                
                if price_response.status_code == 200:
                    price_data = price_response.json()
                    print(f"✅ Price calculation successful:")
                    print(f"   Base price: ₪{price_data['base_price']}")
                    print(f"   Carat weight: {price_data['carat_weight']}")
                    print(f"   Price multiplier: {price_data['price_multiplier']}x")
                    print(f"   Final price: ₪{price_data['final_price']}")
                else:
                    print(f"❌ Price calculation failed: {price_response.status_code}")
                    print(f"   Error: {price_response.text}")
            else:
                print("❌ No carat data found!")
        else:
            print(f"❌ Product fetch failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    print(f"\n=== Test Complete ===")

if __name__ == "__main__":
    test_frontend_flow() 