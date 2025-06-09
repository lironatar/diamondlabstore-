#!/usr/bin/env python3

import requests
import json

# Test the product images API
base_url = "http://localhost:8001/api"

# First, let's get a list of products
try:
    response = requests.get(f"{base_url}/products")
    if response.status_code == 200:
        products = response.json()
        print(f"Found {len(products)} products")
        
        if products:
            # Take the first product
            product = products[0]
            product_id = product['id']
            print(f"Testing with product: {product['name']} (ID: {product_id})")
            
            # Add a test image to this product
            test_image_data = {
                "image_url": "/uploads/test-diamond.jpg",
                "alt_text": "Test diamond image",
                "is_primary": True,
                "sort_order": 0
            }
            
            # Note: This would normally require authentication
            # For testing, let's just check if the endpoint exists
            print(f"Product images endpoint: {base_url}/products/{product_id}/images")
            print(f"Would send data: {json.dumps(test_image_data, indent=2)}")
            
            # Check current images for this product
            images_response = requests.get(f"{base_url}/products/{product_id}/images")
            if images_response.status_code == 200:
                images = images_response.json()
                print(f"Current images for product {product_id}: {len(images)}")
                for img in images:
                    print(f"  - Image {img['id']}: {img['image_url']} (primary: {img['is_primary']})")
            else:
                print(f"Could not retrieve images: {images_response.status_code}")
                
    else:
        print(f"Failed to get products: {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("Could not connect to the API. Make sure the backend server is running on port 8001.")
except Exception as e:
    print(f"Error: {e}") 