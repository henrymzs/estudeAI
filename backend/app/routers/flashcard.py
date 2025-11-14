from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Importações necessárias (ajuste as importações de acordo com a localização real dos seus arquivos)
from app.schemas import FlashcardCreate, FlashcardOut, FlashcardUpdate, UserOut
from app.models import Flashcard, Deck
from app.database import get_db
from app.dependencies import get_current_user 

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"],
    dependencies=[Depends(get_current_user)] # Protege todas as rotas
)

# Função auxiliar para verificar a propriedade do Deck
def check_deck_ownership(db: Session, deck_id: int, user_id: int):
    """Verifica se o Deck existe e pertence ao usuário logado."""
    deck = db.query(Deck).filter(
        Deck.id == deck_id, 
        Deck.usuario_id == user_id
    ).first()
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck não encontrado ou não pertence ao usuário."
        )
    return deck

# CRIAÇÃO
@router.post("/", response_model=FlashcardOut, status_code=status.HTTP_201_CREATED)
def create_flashcard(
    flashcard: FlashcardCreate, 
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """Cria um novo flashcard, garantindo que o deck pertença ao usuário."""
    
    # CRÍTICO: Verifica se o deck_id fornecido pertence ao usuário logado
    check_deck_ownership(db, flashcard.deck_id, current_user.id)
    
    new_flashcard = Flashcard(**flashcard.model_dump())
    
    db.add(new_flashcard)
    db.commit()
    db.refresh(new_flashcard)
    
    return new_flashcard

# LEITURA DE TODOS (Apenas flashcards em decks do usuário)
@router.get("/all", response_model=List[FlashcardOut])
def read_all_flashcards(
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """Retorna todos os flashcards associados a decks que pertencem ao usuário autenticado."""
    
    # Faz um JOIN de Flashcard com Deck e filtra pelo usuario_id do Deck
    flashcards = db.query(Flashcard).join(Deck).filter(
        Deck.usuario_id == current_user.id
    ).all()
    
    return flashcards

# LEITURA DE FLASHCARDS POR DECK ID
@router.get("/deck/{deck_id}", response_model=List[FlashcardOut])
def read_flashcards_by_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """Retorna todos os flashcards de um deck específico, garantindo a propriedade."""

    # Verifica a propriedade do deck 
    check_deck_ownership(db, deck_id, current_user.id)

    # Consulta os flashcards que pertencem a esse deck
    flashcards = db.query(Flashcard).filter(Flashcard.deck_id == deck_id).all()
    
    return flashcards


# LEITURA DE UM ESPECÍFICO
@router.get("/{flashcard_id}", response_model=FlashcardOut)
def read_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """Retorna um flashcard específico, verificando se o deck pertence ao usuário."""
    
    # Junta Flashcard com Deck para verificar a propriedade
    flashcard = db.query(Flashcard).join(Deck).filter(
        Flashcard.id == flashcard_id,
        Deck.usuario_id == current_user.id
    ).first()
    
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard não encontrado ou você não tem permissão para acessá-lo."
        )
        
    return flashcard

# ATUALIZAÇÃO
@router.put("/{flashcard_id}", response_model=FlashcardOut)
def update_flashcard(
    flashcard_id: int,
    flashcard_update: FlashcardUpdate,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """Atualiza um flashcard existente, garantindo que o deck pertença ao usuário."""
    
    flashcard = db.query(Flashcard).join(Deck).filter(
        Flashcard.id == flashcard_id,
        Deck.usuario_id == current_user.id
    ).first()
    
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard não encontrado ou você não tem permissão para editá-lo."
        )

    update_data = flashcard_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(flashcard, key, value)
    
    db.commit()
    db.refresh(flashcard)
    
    return flashcard

# DELEÇÃO
@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """Deleta um flashcard, garantindo que o deck pertença ao usuário."""
    
    flashcard = db.query(Flashcard).join(Deck).filter(
        Flashcard.id == flashcard_id,
        Deck.usuario_id == current_user.id
    ).first()
    
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard não encontrado ou você não tem permissão para deletá-lo."
        )

    db.delete(flashcard)
    db.commit()
    
    return None