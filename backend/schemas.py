from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    hero_image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    is_active: Optional[bool] = None

class CategoryResponse(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# CaratPricing schemas
class CaratPricingBase(BaseModel):
    carat_weight: float
    price_multiplier: float

class CaratPricingCreate(CaratPricingBase):
    is_active: Optional[bool] = True

class CaratPricingUpdate(CaratPricingBase):
    is_active: Optional[bool] = None

class CaratPricingResponse(CaratPricingBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ProductCaratAvailability schemas
class ProductCaratAvailabilityBase(BaseModel):
    carat_weight: float
    is_available: Optional[bool] = True
    is_default: Optional[bool] = False
    sort_order: Optional[int] = 0

class ProductCaratAvailabilityCreate(ProductCaratAvailabilityBase):
    product_id: Optional[int] = None

class ProductCaratAvailabilityResponse(ProductCaratAvailabilityBase):
    id: int
    product_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ProductImage schemas
class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    is_primary: Optional[bool] = False
    sort_order: Optional[int] = 0

class ProductImageCreate(ProductImageBase):
    product_id: Optional[int] = None

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ProductVariant schemas
class ProductVariantBase(BaseModel):
    color_name: str
    color_code: str
    images: Optional[List[str]] = []
    is_default: Optional[bool] = False
    sort_order: Optional[int] = 0

class ProductVariantCreate(ProductVariantBase):
    product_id: Optional[int] = None

class ProductVariantResponse(ProductVariantBase):
    id: int
    product_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    price: float
    image_url: Optional[str] = None
    carat_weight: Optional[float] = None
    color_grade: Optional[str] = None
    clarity_grade: Optional[str] = None
    cut_grade: Optional[str] = None
    shape: Optional[str] = None
    certificate_number: Optional[str] = None
    category_id: int

class ProductCreate(ProductBase):
    is_featured: Optional[bool] = False
    discount_percentage: Optional[float] = 0.0
    available_carats: Optional[List[ProductCaratAvailabilityCreate]] = []

class ProductUpdate(ProductBase):
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    discount_percentage: Optional[float] = None
    available_carats: Optional[List[ProductCaratAvailabilityCreate]] = None

class ProductResponse(ProductBase):
    id: int
    is_available: bool
    is_featured: bool
    discount_percentage: float
    created_at: datetime
    category: Optional[CategoryResponse] = None
    images: Optional[List[ProductImageResponse]] = []
    variants: Optional[List[ProductVariantResponse]] = []
    available_carats: Optional[List[ProductCaratAvailabilityResponse]] = []

    class Config:
        from_attributes = True

# Price calculation response
class PriceCalculationResponse(BaseModel):
    base_price: float
    carat_weight: float
    price_multiplier: float
    calculated_price: float
    discount_percentage: float
    final_price: float

    class Config:
        from_attributes = True 