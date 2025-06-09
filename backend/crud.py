from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
import models
import schemas
from typing import Optional

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Import inside function to avoid circular import
    from auth import get_password_hash
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        phone=user.phone,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Category CRUD
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).filter(models.Category.is_active == True).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: schemas.CategoryUpdate):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category:
        update_data = category.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category

# Carat Pricing CRUD
def get_carat_pricing(db: Session, skip: int = 0, limit: int = 100):
    """Get all active carat pricing configurations"""
    return db.query(models.CaratPricing).filter(models.CaratPricing.is_active == True).order_by(models.CaratPricing.carat_weight).offset(skip).limit(limit).all()

def get_carat_pricing_by_weight(db: Session, carat_weight: float):
    """Get specific carat pricing by weight"""
    return db.query(models.CaratPricing).filter(
        and_(
            models.CaratPricing.carat_weight == carat_weight,
            models.CaratPricing.is_active == True
        )
    ).first()

def create_carat_pricing(db: Session, carat_pricing: schemas.CaratPricingCreate):
    """Create new carat pricing configuration"""
    db_carat_pricing = models.CaratPricing(**carat_pricing.dict())
    db.add(db_carat_pricing)
    db.commit()
    db.refresh(db_carat_pricing)
    return db_carat_pricing

def update_carat_pricing(db: Session, carat_pricing_id: int, carat_pricing: schemas.CaratPricingUpdate):
    """Update carat pricing configuration"""
    db_carat_pricing = db.query(models.CaratPricing).filter(models.CaratPricing.id == carat_pricing_id).first()
    if db_carat_pricing:
        update_data = carat_pricing.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_carat_pricing, field, value)
        db.commit()
        db.refresh(db_carat_pricing)
    return db_carat_pricing

def delete_carat_pricing(db: Session, carat_pricing_id: int):
    """Delete carat pricing configuration"""
    db_carat_pricing = db.query(models.CaratPricing).filter(models.CaratPricing.id == carat_pricing_id).first()
    if db_carat_pricing:
        db.delete(db_carat_pricing)
        db.commit()
    return db_carat_pricing

def calculate_price_for_carat(db: Session, base_price: float, carat_weight: float, discount_percentage: float = 0.0):
    """Calculate price for a specific carat weight"""
    carat_pricing = get_carat_pricing_by_weight(db, carat_weight)
    if not carat_pricing:
        # Default to 1.0 multiplier if carat pricing not found
        price_multiplier = 1.0
    else:
        price_multiplier = carat_pricing.price_multiplier
    
    calculated_price = base_price * price_multiplier
    final_price = calculated_price * (1 - discount_percentage / 100)
    
    return {
        "base_price": base_price,
        "carat_weight": carat_weight,
        "price_multiplier": price_multiplier,
        "calculated_price": calculated_price,
        "discount_percentage": discount_percentage,
        "final_price": final_price
    }

# Product Carat Availability CRUD
def get_product_available_carats(db: Session, product_id: int):
    """Get all available carat weights for a product"""
    return db.query(models.ProductCaratAvailability).filter(
        and_(
            models.ProductCaratAvailability.product_id == product_id,
            models.ProductCaratAvailability.is_available == True
        )
    ).order_by(models.ProductCaratAvailability.sort_order).all()

def create_product_carat_availability(db: Session, product_carat: schemas.ProductCaratAvailabilityCreate):
    """Add carat availability for a product"""
    db_product_carat = models.ProductCaratAvailability(**product_carat.dict())
    db.add(db_product_carat)
    db.commit()
    db.refresh(db_product_carat)
    return db_product_carat

def update_product_carat_availability(db: Session, product_carat_id: int, product_carat: schemas.ProductCaratAvailabilityCreate):
    """Update product carat availability"""
    db_product_carat = db.query(models.ProductCaratAvailability).filter(models.ProductCaratAvailability.id == product_carat_id).first()
    if db_product_carat:
        for key, value in product_carat.dict(exclude_unset=True).items():
            setattr(db_product_carat, key, value)
        db.commit()
        db.refresh(db_product_carat)
    return db_product_carat

def delete_product_carat_availability(db: Session, product_carat_id: int):
    """Delete product carat availability"""
    db_product_carat = db.query(models.ProductCaratAvailability).filter(models.ProductCaratAvailability.id == product_carat_id).first()
    if db_product_carat:
        db.delete(db_product_carat)
        db.commit()
    return db_product_carat

def set_default_carat_for_product(db: Session, product_id: int, carat_weight: float):
    """Set a specific carat as default for a product"""
    # First, remove default status from all carats for this product
    db.query(models.ProductCaratAvailability).filter(
        models.ProductCaratAvailability.product_id == product_id
    ).update({"is_default": False})
    
    # Set the specified carat as default
    db.query(models.ProductCaratAvailability).filter(
        and_(
            models.ProductCaratAvailability.product_id == product_id,
            models.ProductCaratAvailability.carat_weight == carat_weight
        )
    ).update({"is_default": True})
    
    db.commit()

# Product CRUD (Updated)
def get_products(db: Session, skip: int = 0, limit: int = 100, category_id: Optional[int] = None):
    query = db.query(models.Product).options(
        joinedload(models.Product.images),
        joinedload(models.Product.variants),
        joinedload(models.Product.available_carats)
    ).filter(models.Product.is_available == True)
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    return query.offset(skip).limit(limit).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).options(
        joinedload(models.Product.images),
        joinedload(models.Product.variants),
        joinedload(models.Product.available_carats)
    ).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    # Extract available_carats before creating product
    available_carats = product.available_carats or []
    product_data = product.dict(exclude={"available_carats"})
    
    db_product = models.Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Add carat availability if provided
    for carat_data in available_carats:
        carat_data.product_id = db_product.id
        create_product_carat_availability(db, carat_data)
    
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        # Handle available_carats separately
        available_carats = product.available_carats
        update_data = product.dict(exclude_unset=True, exclude={"available_carats"})
        
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        # Update carat availability if provided
        if available_carats is not None:
            # Delete existing carat availability
            db.query(models.ProductCaratAvailability).filter(
                models.ProductCaratAvailability.product_id == product_id
            ).delete()
            
            # Add new carat availability
            for carat_data in available_carats:
                carat_data.product_id = product_id
                create_product_carat_availability(db, carat_data)
        
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

def get_featured_products(db: Session, limit: int = 6):
    """Get featured products marked by admins"""
    return db.query(models.Product).options(
        joinedload(models.Product.images),
        joinedload(models.Product.available_carats)
    ).filter(
        and_(
            models.Product.is_available == True,
            models.Product.is_featured == True
        )
    ).limit(limit).all()

def toggle_product_featured(db: Session, product_id: int):
    """Toggle the featured status of a product"""
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db_product.is_featured = not db_product.is_featured
        db.commit()
        db.refresh(db_product)
    return db_product

def get_discounted_products(db: Session, limit: int = 6):
    """Get products with discounts"""
    return db.query(models.Product).options(
        joinedload(models.Product.images),
        joinedload(models.Product.available_carats)
    ).filter(
        and_(
            models.Product.is_available == True,
            models.Product.discount_percentage > 0
        )
    ).order_by(models.Product.discount_percentage.desc()).limit(limit).all()

# Product Image CRUD
def create_product_image(db: Session, product_image: schemas.ProductImageCreate):
    db_image = models.ProductImage(**product_image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_product_images(db: Session, product_id: int):
    return db.query(models.ProductImage).filter(
        models.ProductImage.product_id == product_id
    ).order_by(models.ProductImage.sort_order).all()

def delete_product_image(db: Session, image_id: int):
    db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
    if db_image:
        db.delete(db_image)
        db.commit()
    return db_image

# Product Variant CRUD
def create_product_variant(db: Session, variant: schemas.ProductVariantCreate):
    db_variant = models.ProductVariant(**variant.dict())
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)
    return db_variant

def get_product_variants(db: Session, product_id: int):
    return db.query(models.ProductVariant).filter(
        models.ProductVariant.product_id == product_id
    ).order_by(models.ProductVariant.sort_order).all()

def update_product_variant(db: Session, variant_id: int, variant: schemas.ProductVariantCreate):
    db_variant = db.query(models.ProductVariant).filter(models.ProductVariant.id == variant_id).first()
    if db_variant:
        for key, value in variant.dict(exclude_unset=True).items():
            setattr(db_variant, key, value)
        db.commit()
        db.refresh(db_variant)
    return db_variant

def delete_product_variant(db: Session, variant_id: int):
    db_variant = db.query(models.ProductVariant).filter(models.ProductVariant.id == variant_id).first()
    if db_variant:
        db.delete(db_variant)
        db.commit()
    return db_variant 