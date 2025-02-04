from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    product: Product

    class Config:
        orm_mode = True






class UserCreate(BaseModel):
    username: str
    password: str

# Foydalanuvchi qaytarish uchun schema
class User(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True