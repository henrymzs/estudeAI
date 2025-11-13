from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120))
    email = Column(String(255), unique=True, index=True, nullable=False)
    senha = Column(String(255), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

# DECK
class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True, index=True)
    
    # CHAVE ESTRANGEIRA PARA USUÁRIO (usuario_id)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    
    titulo = Column(String(255), nullable=False)
    descricao = Column(String(500), nullable=True)
    
    criado_em = Column(DateTime, default=datetime.utcnow)
    
    # RELACIONAMENTO: Um Deck pode ter muitos Flashcards
    # 'cascade' garante que, se o deck for deletado, os flashcards também sejam.
    flashcards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Deck(id={self.id}, titulo='{self.titulo}', usuario_id={self.usuario_id})>"

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    
    # CHAVE ESTRANGEIRA PARA DECK (deck_id)
    deck_id = Column(Integer, ForeignKey("decks.id"), nullable=False, index=True)
    
    pergunta = Column(String(500), nullable=False)
    resposta = Column(String(1000), nullable=False)
    
    criado_em = Column(DateTime, default=datetime.utcnow)
    
    # RELACIONAMENTO: Um Flashcard pertence a um Deck
    deck = relationship("Deck", back_populates="flashcards")

    def __repr__(self):
        return f"<Flashcard(id={self.id}, deck_id={self.deck_id}, pergunta='{self.pergunta[:30]}...')>"