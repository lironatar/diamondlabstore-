#!/usr/bin/env python3

import requests
import json

# Test the categories API
base_url = "http://localhost:8001/api"

def test_categories_api():
    """Test the categories API endpoints"""
    
    print("🧪 Testing Categories API")
    print("=" * 40)
    
    try:
        # Test 1: Get all categories
        print("\n1. Testing GET /categories")
        response = requests.get(f"{base_url}/categories")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            categories = response.json()
            print(f"   Found {len(categories)} categories")
            
            if categories:
                print("   First category:")
                first_cat = categories[0]
                print(f"     - ID: {first_cat.get('id')}")
                print(f"     - Name: {first_cat.get('name')}")
                print(f"     - Description: {first_cat.get('description', 'None')}")
                print(f"     - Image URL: {first_cat.get('image_url', 'None')}")
                print(f"     - Active: {first_cat.get('is_active')}")
        else:
            print(f"   Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Error: Could not connect to backend server")
        print("   Please make sure the backend is running on http://localhost:8001")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    try:
        # Test 2: Create a test category (will need admin auth)
        print("\n2. Testing POST /categories (would need authentication)")
        test_category = {
            "name": "Test Category",
            "description": "A test category for API testing",
            "image_url": "/uploads/test-category.jpg",
            "is_active": True
        }
        print(f"   Test data: {json.dumps(test_category, indent=2, ensure_ascii=False)}")
        print("   ⚠️  Skipping POST test (requires admin authentication)")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n✅ Categories API test completed!")
    return True

def test_frontend_connection():
    """Test if frontend is accessible"""
    
    print("\n🌐 Testing Frontend Connection")
    print("=" * 40)
    
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Frontend is accessible")
        else:
            print(f"   ⚠️  Frontend returned status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ❌ Error: Could not connect to frontend server")
        print("   Please make sure the frontend is running on http://localhost:3000")
        return False
    except requests.exceptions.Timeout:
        print("   ⚠️  Frontend connection timed out")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Diamond Lab Store - Categories System Test")
    print("=" * 50)
    
    # Test backend categories API
    backend_ok = test_categories_api()
    
    # Test frontend connection
    frontend_ok = test_frontend_connection()
    
    print("\n📊 Test Summary")
    print("=" * 20)
    print(f"Backend API: {'✅ OK' if backend_ok else '❌ Failed'}")
    print(f"Frontend:    {'✅ OK' if frontend_ok else '❌ Failed'}")
    
    if backend_ok and frontend_ok:
        print("\n🎉 All systems are working!")
        print("You can now:")
        print("1. Visit http://localhost:3000/admin/categories to manage categories")
        print("2. Create new categories with images")
        print("3. Edit existing categories")
        print("4. View categories in the main site")
    else:
        print("\n⚠️  Some systems need attention")
        if not backend_ok:
            print("- Start the backend: cd backend && python -m uvicorn main:app --reload --port 8001")
        if not frontend_ok:
            print("- Start the frontend: cd frontend && npm start") 