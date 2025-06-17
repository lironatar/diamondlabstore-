import requests
import json

def test_product_1_api():
    base_url = "http://localhost:8001"
    
    try:
        # Test product 1 endpoint
        response = requests.get(f"{base_url}/api/products/1")
        print(f"Product 1 API Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Product Name: {data.get('name')}")
            print(f"Product Price: {data.get('price')}")
            print(f"Image URL: {data.get('image_url')}")
            print(f"Available Carats: {len(data.get('available_carats', []))}")
            print(f"Images: {len(data.get('images', []))}")
            
            # Show carat data
            carats = data.get('available_carats', [])
            if carats:
                print("\nCarat options:")
                for carat in carats[:5]:  # Show first 5
                    print(f"  - {carat.get('carat_weight')} carat (ID: {carat.get('id')})")
            else:
                print("\n❌ No carat data in API response!")
            
            # Show image data
            images = data.get('images', [])
            if images:
                print("\nImages:")
                for img in images:
                    print(f"  - {img.get('image_url')} (primary: {img.get('is_primary')})")
            else:
                print("\n❌ No image data in API response!")
                
            # Test price calculation
            if carats:
                first_carat = carats[0]['carat_weight']
                print(f"\nTesting price for {first_carat} carat...")
                price_response = requests.get(f"{base_url}/api/products/1/price/{first_carat}")
                print(f"Price API Status: {price_response.status_code}")
                if price_response.status_code == 200:
                    price_data = price_response.json()
                    print(f"Final price: ₪{price_data['final_price']}")
                else:
                    print(f"Price error: {price_response.text}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    test_product_1_api() 