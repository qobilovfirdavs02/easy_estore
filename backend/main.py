from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from fastapi.middleware.cors import CORSMiddleware
from models import Product, CartItem
from schemas import CartItemCreate
from pydantic import BaseModel
from typing import List
from schemas import ProductCreate, ProductBase
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from database import engine, SessionLocal
from models import Base, Product
from models import Base, User
from schemas import UserCreate
from datetime import datetime, timedelta
from jose import JWTError, jwt
# Bazani yaratish
models.Base.metadata.create_all(bind=engine)

# Ilovani yaratish
app = FastAPI()

# Database sessiyasi
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()







class CartItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: float

class PurchaseRequest(BaseModel):
    items: List[CartItem]

@app.post("/purchase")
def purchase(request: PurchaseRequest):
    if not request.items:
        raise HTTPException(status_code=400, detail="Savatcha bo'sh!")
    
    # Sotib olish jarayonini backendda qayta ishlash
    total = sum(item.price * item.quantity for item in request.items)
    return {"message": "Sotib olish muvaffaqiyatli amalga oshirildi!", "total": total}







Base.metadata.create_all(bind=engine)

# Foydalanuvchi yaratish
@app.post("/register")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Yangi foydalanuvchi yaratish
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Foydalanuvchi allaqachon mavjud")
    
    hashed_password = User.hash_password(user.password)  # Parolni xesh qilish
    new_user = User(username=user.username, password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Foydalanuvchi yaratildi", "user": new_user}

# Token olish
@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Login va parolni tekshirish
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not User.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=401, detail="Noto'g'ri login yoki parol"
        )
    return {"access_token": "fake_token", "token_type": "bearer"}









# OAuth2PasswordBearer tokenni olish
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Parolni xesh qilish
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT uchun sarlavha va maxfiy kalit
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Foydalanuvchi yaratish
class UserCreate(BaseModel):
    username: str
    password: str

# Foydalanuvchini tekshirish
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# JWT tokenni yaratish
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/login")
def login_for_access_token(form_data: UserCreate, db: Session = Depends(get_db)):
    # Foydalanuvchini tekshirish
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=401, detail="Username yoki parol noto'g'ri"
        )

    # JWT tokenni yaratish
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}















# CORS sozlamalari
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Faqat kerakli domenlarni qo‘shishni tavsiya qilamiz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Mahsulotlar API

@app.get("/products", response_model=list[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product





@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    return product

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    db.delete(db_product)
    db.commit()
    return {"detail": "Mahsulot o'chirildi"}

# Savatcha API

@app.get("/cart", response_model=list[schemas.CartItem])
def get_cart(db: Session = Depends(get_db)):
    return db.query(models.Cart).all()

@app.post("/cart", response_model=schemas.CartItem)
def add_to_cart(cart_item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    db_cart = models.Cart(**cart_item.dict())
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

# Savatchaga mahsulot qo‘shish
@app.post("/cart/")
def add_to_cart(cart_item: CartItemCreate, db: Session = Depends(get_db)):
    # Mahsulotni tekshirish
    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")

    # Savatchaga mahsulotni qo‘shish
    existing_item = db.query(CartItem).filter(CartItem.product_id == cart_item.product_id).first()
    if existing_item:
        existing_item.quantity += cart_item.quantity
    else:
        new_cart_item = CartItem(product_id=cart_item.product_id, quantity=cart_item.quantity)
        db.add(new_cart_item)

    db.commit()
    return {"message": "Mahsulot savatchaga qo'shildi"}
