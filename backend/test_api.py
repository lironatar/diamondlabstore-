import requests
import json

def test_product_api():
    base_url = "http://localhost:8001"
    
    try:
        # Test product endpoint
        response = requests.get(f"{base_url}/api/products/2")
        print(f"Product API Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Product Name: {data.get('name')}")
            print(f"Product Price: {data.get('price')}")
            print(f"Available Carats: {len(data.get('available_carats', []))}")
            
            for carat in data.get('available_carats', [])[:5]:  # Show first 5
                print(f"  - {carat.get('carat_weight')} carat (ID: {carat.get('id')})")
        else:
            print(f"Error: {response.text}")
            
        # Test price calculation endpoint
        print("\n--- Testing Price Calculation ---")
        response = requests.get(f"{base_url}/api/products/2/price/1.0")
        print(f"Price API Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Price calculation: {json.dumps(data, indent=2)}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    test_product_api() 