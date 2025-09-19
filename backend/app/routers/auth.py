from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models, database 

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(user: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not security.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = security.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}
