from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    hero_image_url = Column(String, nullable=True)  # New field for hero images
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="category")

class CaratPricing(Base):
    __tablename__ = "carat_pricing"

    id = Column(Integer, primary_key=True, index=True)
    carat_weight = Column(Float, nullable=False, unique=True, index=True)  # e.g., 0.5, 1.0, 1.5, 2.0
    price_multiplier = Column(Float, nullable=False)  # Multiplier for base price
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    base_price = Column(Float, nullable=False)  # Base price for calculations
    price = Column(Float, nullable=False)  # Display price (can be base or specific carat)
    image_url = Column(String, nullable=True)
    carat_weight = Column(Float, nullable=True)  # Default/display carat weight
    color_grade = Column(String, nullable=True)  # D, E, F, G, H, I, J
    clarity_grade = Column(String, nullable=True)  # FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2
    cut_grade = Column(String, nullable=True)  # Excellent, Very Good, Good, Fair, Poor
    shape = Column(String, nullable=True)  # Round, Princess, Emerald, etc.
    certificate_number = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    discount_percentage = Column(Float, default=0.0)  # Discount percentage (0-100)
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    available_carats = relationship("ProductCaratAvailability", back_populates="product", cascade="all, delete-orphan")

class ProductCaratAvailability(Base):
    __tablename__ = "product_carat_availability"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    carat_weight = Column(Float, nullable=False)  # Available carat size for this product
    is_available = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)  # Default selected carat for this product
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="available_carats")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    is_primary = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="images")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    color_name = Column(String, nullable=False)  # e.g., "Rose Gold", "White Gold", "Yellow Gold"
    color_code = Column(String, nullable=False)  # hex color code for UI display
    images = Column(JSON, nullable=True)  # array of image URLs for this variant
    is_default = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="variants") 