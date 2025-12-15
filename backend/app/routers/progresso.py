from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["progresso"]
)

@router.get("/stats")
def get_user_stats(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return {
        "total_decks": db.execute(
            text("""
                SELECT COUNT(*) 
                FROM decks 
                WHERE usuario_id = :id
            """),
            {"id": current_user.id}
        ).scalar(),

        # flashcards do usuário via DECK
        "total_cards": db.execute(
            text("""
                SELECT COUNT(*)
                FROM flashcards f
                JOIN decks d ON f.deck_id = d.id
                WHERE d.usuario_id = :id
            """),
            {"id": current_user.id}
        ).scalar(),

        # progresso do usuário permanece o mesmo
        "total_cards_studied": db.execute(
            text("""
                SELECT COUNT(*) 
                FROM progresso 
                WHERE usuario_id = :id
            """),
            {"id": current_user.id}
        ).scalar(),
    }
