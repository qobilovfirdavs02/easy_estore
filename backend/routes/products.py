from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Product
from schemas import ProductCreate, Product
from database import get_db

router = APIRouter()

# Mahsulotlar ro'yxati
@router.get("/", response_model=list[Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

# Mahsulot qo'shish
@router.post("/", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Mahsulot o'chirish
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Mahsulot topilmadi")
    db.delete(product)
    db.commit()
    return {"message": "Mahsulot o'chirildi"}
