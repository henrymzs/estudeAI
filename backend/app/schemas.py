from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

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
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    senha: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# --- Schemas de Flashcard ---

class FlashcardOut(BaseModel):
    id: int
    deck_id: int
    pergunta: str
    resposta: str
    criado_em: datetime
    
    class Config:
        from_attributes = True

class FlashcardCreate(BaseModel):
    deck_id: int 
    pergunta: str = Field(..., max_length=500)
    resposta: str = Field(..., max_length=1000)

class FlashcardUpdate(BaseModel):
    pergunta: Optional[str] = Field(None, max_length=500)
    resposta: Optional[str] = Field(None, max_length=1000)

# --- Schemas de Deck ---

class DeckCreate(BaseModel):
    titulo: str = Field(..., max_length=255)
    descricao: Optional[str] = Field(None, max_length=500)

class DeckOut(BaseModel):
    id: int
    usuario_id: int
    titulo: str
    descricao: Optional[str]
    criado_em: datetime

    class Config:
        from_attributes = True

class DeckFullOut(DeckOut):
    flashcards: List[FlashcardOut] = []
    
    class Config:
        from_attributes = True

class DeckUpdate(BaseModel):
    titulo: Optional[str] = Field(None, max_length=255)
    descricao: Optional[str] = Field(None, max_length=500)

# Schema auxiliar para o payload do token
class TokenData(BaseModel):
    sub: Optional[str] = None