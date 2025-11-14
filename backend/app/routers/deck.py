from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Importações necessárias
from app.schemas import DeckCreate, DeckOut, DeckUpdate, DeckFullOut, UserOut 
from app.models import Deck, Usuario 
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/decks",
    tags=["Decks"],
    # IMPORTANTE: A dependência global foi removida!
)

# CRIAÇÃO
# =========================================================================================
# ESTA ROTA FOI DESPROTEGIDA E USA O ID FIXO 1
# =========================================================================================
@router.post("/", response_model=DeckOut, status_code=status.HTTP_201_CREATED)
def create_deck(
    deck: DeckCreate, 
    db: Session = Depends(get_db),
    # A dependência get_current_user FOI REMOVIDA DA ASSINATURA DA FUNÇÃO
):
    """Cria um novo deck e o associa ao usuário (TEMPORARIAMENTE ID 1)."""
    
    # ID TEMPORÁRIO para que o pedido do Expo passe.
    TEMP_USER_ID = 1

    new_deck = Deck(
        **deck.model_dump(),
        usuario_id=TEMP_USER_ID
    )
    
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    
    return new_deck

# LEITURA DE TODOS (Reaplicando a proteção individualmente)
@router.get("/", response_model=List[DeckOut])
def read_all_decks(
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user) # PROTEÇÃO REAPLICADA
):
    """Retorna todos os decks criados pelo usuário autenticado."""
    
    decks = db.query(Deck).filter(Deck.usuario_id == current_user.id).all()
    
    return decks

# LEITURA DE UM ESPECÍFICO (com flashcards) (Reaplicando a proteção individualmente)
@router.get("/{deck_id}", response_model=DeckFullOut)
def read_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user) # PROTEÇÃO REAPLICADA
):
    """Retorna um deck específico, garantindo que pertença ao usuário."""
    
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

# ATUALIZAÇÃO (Reaplicando a proteção individualmente)
@router.put("/{deck_id}", response_model=DeckOut)
def update_deck(
    deck_id: int,
    deck_update: DeckUpdate,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user) # PROTEÇÃO REAPLICADA
):
    """Atualiza o conteúdo de um deck existente, garantindo que pertença ao usuário."""
    
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

# DELEÇÃO (Reaplicando a proteção individualmente)
@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user) # PROTEÇÃO REAPLICADA
):
    """Deleta um deck e todos os flashcards associados (cascata), garantindo que pertença ao usuário."""
    
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