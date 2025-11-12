from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UserOut(BaseModel):
    id: int
    nome: str
    email: str
    criado_em: datetime

    class Config:
        # ✅ CORREÇÃO: Renomear 'orm_mode' para 'from_attributes' (Pydantic V2)
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"