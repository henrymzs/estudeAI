from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas import DeckCreate, DeckOut, DeckUpdate, DeckFullOut
from app.models import Deck, Usuario
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/decks",
    tags=["Decks"],
)

# =========================================================================================
# CRIAÇÃO
# =========================================================================================
@router.post("/", response_model=DeckOut, status_code=status.HTTP_201_CREATED)
def create_deck(
    deck: DeckCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Cria um novo deck e associa ao usuário autenticado."""
    
    new_deck = Deck(
        **deck.model_dump(),
        usuario_id=current_user.id
    )
    
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    
    return new_deck


# =========================================================================================
# LISTAR TODOS OS DECKS DO USUÁRIO
# =========================================================================================
@router.get("/", response_model=List[DeckOut])
def read_all_decks(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Retorna todos os decks criados pelo usuário autenticado."""
    
    decks = db.query(Deck).filter(Deck.usuario_id == current_user.id).all()
    return decks


# =========================================================================================
# LER UM DECK ESPECÍFICO
# =========================================================================================
@router.get("/{deck_id}", response_model=DeckFullOut)
def read_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Retorna um deck específico garantindo que pertença ao usuário."""
    
    deck = db.query(Deck).filter(
        Deck.id == deck_id,
        Deck.usuario_id == current_user.id
    ).first()
    
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck não encontrado ou você não tem permissão para acessá-lo."
        )
        
    return deck


# =========================================================================================
# ATUALIZAÇÃO
# =========================================================================================
@router.put("/{deck_id}", response_model=DeckOut)
def update_deck(
    deck_id: int,
    deck_update: DeckUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Atualiza um deck garantindo que pertença ao usuário."""
    
    deck = db.query(Deck).filter(
        Deck.id == deck_id,
        Deck.usuario_id == current_user.id
    ).first()
    
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck não encontrado ou você não tem permissão para editá-lo."
        )

    update_data = deck_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(deck, key, value)
    
    db.commit()
    db.refresh(deck)
    
    return deck


# =========================================================================================
# DELEÇÃO
# =========================================================================================
@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Deleta um deck garantindo que pertença ao usuário."""
    
    deck = db.query(Deck).filter(
        Deck.id == deck_id,
        Deck.usuario_id == current_user.id
    ).first()
    
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck não encontrado ou você não tem permissão para deletá-lo."
        )

    db.delete(deck)
    db.commit()
    return None
