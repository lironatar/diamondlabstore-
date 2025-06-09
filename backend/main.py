from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil
from pathlib import Path
from decouple import config

from database import SessionLocal, engine
import models
import schemas
import auth
from auth import get_current_user, get_current_admin_user
import crud

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Diamond Lab Store API")

# CORS middleware
allowed_origins = config('ALLOWED_ORIGINS', default='http://localhost:3000,http://localhost:3001').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Create uploads directory
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

# Serve static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth Routes
@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="המייל כבר רשום במערכת"
        )
    return crud.create_user(db=db, user=user)

@app.post("/api/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = auth.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="מייל או סיסמה שגויים",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": schemas.UserResponse.from_orm(db_user)}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# Category Routes
@app.get("/api/categories", response_model=List[schemas.CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

@app.post("/api/categories", response_model=schemas.CategoryResponse)
def create_category(
    category: schemas.CategoryCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    return crud.create_category(db=db, category=category)

@app.put("/api/categories/{category_id}", response_model=schemas.CategoryResponse)
def update_category(
    category_id: int,
    category: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_category = crud.get_category(db, category_id=category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="קטגוריה לא נמצאה")
    return crud.update_category(db=db, category_id=category_id, category=category)

@app.delete("/api/categories/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_category = crud.get_category(db, category_id=category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="קטגוריה לא נמצאה")
    crud.delete_category(db=db, category_id=category_id)
    return {"message": "קטגוריה נמחקה בהצלחה"}

# Product Routes
@app.get("/api/products", response_model=List[schemas.ProductResponse])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    products = crud.get_products(db, skip=skip, limit=limit, category_id=category_id)
    return products

@app.get("/api/products/featured", response_model=List[schemas.ProductResponse])
def read_featured_products(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """Get featured products marked by admins"""
    featured_products = crud.get_featured_products(db, limit=limit)
    return featured_products

@app.get("/api/products/discounted", response_model=List[schemas.ProductResponse])
def read_discounted_products(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """Get products with discounts"""
    discounted_products = crud.get_discounted_products(db, limit=limit)
    return discounted_products

@app.get("/api/products/{product_id}", response_model=schemas.ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    return db_product

@app.post("/api/products", response_model=schemas.ProductResponse)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    return crud.create_product(db=db, product=product)

@app.put("/api/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    product: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    return crud.update_product(db=db, product_id=product_id, product=product)

@app.put("/api/products/{product_id}/featured", response_model=schemas.ProductResponse)
def toggle_product_featured(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Toggle featured status of a product (admin only)"""
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    return crud.toggle_product_featured(db=db, product_id=product_id)

@app.delete("/api/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    crud.delete_product(db=db, product_id=product_id)
    return {"message": "מוצר נמחק בהצלחה"}

# Product Image Routes
@app.post("/api/products/{product_id}/images", response_model=schemas.ProductImageResponse)
def add_product_image(
    product_id: int,
    image: schemas.ProductImageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    # Set product_id
    image.product_id = product_id
    return crud.create_product_image(db=db, product_image=image)

@app.get("/api/products/{product_id}/images", response_model=List[schemas.ProductImageResponse])
def get_product_images(
    product_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_product_images(db, product_id=product_id)

@app.delete("/api/products/{product_id}/images/{image_id}")
def delete_product_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    image = crud.delete_product_image(db, image_id=image_id)
    if not image:
        raise HTTPException(status_code=404, detail="תמונה לא נמצאה")
    return {"message": "תמונה נמחקה בהצלחה"}

# Product Variant Routes
@app.post("/api/products/{product_id}/variants", response_model=schemas.ProductVariantResponse)
def create_product_variant(
    product_id: int,
    variant: schemas.ProductVariantCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    # Set product_id
    variant.product_id = product_id
    return crud.create_product_variant(db=db, variant=variant)

@app.get("/api/products/{product_id}/variants", response_model=List[schemas.ProductVariantResponse])
def get_product_variants(
    product_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_product_variants(db, product_id=product_id)

@app.put("/api/products/{product_id}/variants/{variant_id}", response_model=schemas.ProductVariantResponse)
def update_product_variant(
    product_id: int,
    variant_id: int,
    variant: schemas.ProductVariantCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_variant = crud.update_product_variant(db, variant_id=variant_id, variant=variant)
    if not db_variant:
        raise HTTPException(status_code=404, detail="גרסת המוצר לא נמצאה")
    return db_variant

@app.delete("/api/products/{product_id}/variants/{variant_id}")
def delete_product_variant(
    product_id: int,
    variant_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    db_variant = crud.delete_product_variant(db=db, variant_id=variant_id)
    if not db_variant:
        raise HTTPException(status_code=404, detail="גרסת מוצר לא נמצאה")
    return {"message": "גרסת מוצר נמחקה בהצלחה"}

# Carat Pricing Routes
@app.get("/api/carat-pricing", response_model=List[schemas.CaratPricingResponse])
def get_carat_pricing(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all active carat pricing configurations"""
    return crud.get_carat_pricing(db, skip=skip, limit=limit)

@app.get("/api/carat-pricing/{carat_weight}", response_model=schemas.CaratPricingResponse)
def get_carat_pricing_by_weight(
    carat_weight: float,
    db: Session = Depends(get_db)
):
    """Get specific carat pricing by weight"""
    carat_pricing = crud.get_carat_pricing_by_weight(db, carat_weight=carat_weight)
    if not carat_pricing:
        raise HTTPException(status_code=404, detail="תמחור קראט לא נמצא")
    return carat_pricing

@app.post("/api/carat-pricing", response_model=schemas.CaratPricingResponse)
def create_carat_pricing(
    carat_pricing: schemas.CaratPricingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Create new carat pricing configuration (admin only)"""
    try:
        return crud.create_carat_pricing(db=db, carat_pricing=carat_pricing)
    except Exception as e:
        raise HTTPException(status_code=400, detail="שגיאה ביצירת תמחור קראט - יתכן שהמשקל כבר קיים")

@app.put("/api/carat-pricing/{carat_pricing_id}", response_model=schemas.CaratPricingResponse)
def update_carat_pricing(
    carat_pricing_id: int,
    carat_pricing: schemas.CaratPricingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Update carat pricing configuration (admin only)"""
    updated_carat_pricing = crud.update_carat_pricing(db=db, carat_pricing_id=carat_pricing_id, carat_pricing=carat_pricing)
    if not updated_carat_pricing:
        raise HTTPException(status_code=404, detail="תמחור קראט לא נמצא")
    return updated_carat_pricing

@app.delete("/api/carat-pricing/{carat_pricing_id}")
def delete_carat_pricing(
    carat_pricing_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Delete carat pricing configuration (admin only)"""
    deleted_carat_pricing = crud.delete_carat_pricing(db=db, carat_pricing_id=carat_pricing_id)
    if not deleted_carat_pricing:
        raise HTTPException(status_code=404, detail="תמחור קראט לא נמצא")
    return {"message": "תמחור קראט נמחק בהצלחה"}

# Product Carat Availability Routes
@app.get("/api/products/{product_id}/carats", response_model=List[schemas.ProductCaratAvailabilityResponse])
def get_product_available_carats(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Get all available carat weights for a product"""
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    return crud.get_product_available_carats(db, product_id=product_id)

@app.post("/api/products/{product_id}/carats", response_model=schemas.ProductCaratAvailabilityResponse)
def add_product_carat_availability(
    product_id: int,
    product_carat: schemas.ProductCaratAvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Add carat availability for a product (admin only)"""
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    product_carat.product_id = product_id
    return crud.create_product_carat_availability(db=db, product_carat=product_carat)

@app.put("/api/products/{product_id}/carats/{carat_id}", response_model=schemas.ProductCaratAvailabilityResponse)
def update_product_carat_availability(
    product_id: int,
    carat_id: int,
    product_carat: schemas.ProductCaratAvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Update product carat availability (admin only)"""
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    updated_carat = crud.update_product_carat_availability(db=db, product_carat_id=carat_id, product_carat=product_carat)
    if not updated_carat:
        raise HTTPException(status_code=404, detail="זמינות קראט לא נמצאה")
    return updated_carat

@app.delete("/api/products/{product_id}/carats/{carat_id}")
def delete_product_carat_availability(
    product_id: int,
    carat_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Delete product carat availability (admin only)"""
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    deleted_carat = crud.delete_product_carat_availability(db=db, product_carat_id=carat_id)
    if not deleted_carat:
        raise HTTPException(status_code=404, detail="זמינות קראט לא נמצאה")
    return {"message": "זמינות קראט נמחקה בהצלחה"}

@app.put("/api/products/{product_id}/carats/{carat_weight}/set-default")
def set_default_carat_for_product(
    product_id: int,
    carat_weight: float,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    """Set a specific carat as default for a product (admin only)"""
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    crud.set_default_carat_for_product(db=db, product_id=product_id, carat_weight=carat_weight)
    return {"message": f"קראט {carat_weight} הוגדר כברירת מחדל למוצר"}

# Price Calculation Route
@app.get("/api/products/{product_id}/price/{carat_weight}", response_model=schemas.PriceCalculationResponse)
def calculate_product_price(
    product_id: int,
    carat_weight: float,
    db: Session = Depends(get_db)
):
    """Calculate price for a specific product and carat weight"""
    # Verify product exists
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="מוצר לא נמצא")
    
    # Verify carat is available for this product
    available_carats = crud.get_product_available_carats(db, product_id=product_id)
    available_carat_weights = [carat.carat_weight for carat in available_carats]
    
    if carat_weight not in available_carat_weights:
        raise HTTPException(status_code=400, detail="משקל קראט זה אינו זמין למוצר זה")
    
    price_calculation = crud.calculate_price_for_carat(
        db=db,
        base_price=db_product.base_price,
        carat_weight=carat_weight,
        discount_percentage=db_product.discount_percentage
    )
    
    return schemas.PriceCalculationResponse(**price_calculation)

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_admin_user)
):
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="סוג קובץ לא נתמך. יש להעלות תמונות בלבד")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = uploads_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return file URL
    file_url = f"/uploads/{unique_filename}"
    return {"url": file_url, "filename": unique_filename}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 