from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models
from app.database import get_db
from app.utils.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user # <--- IMPORTAÇÃO CRÍTICA

# O router está prefixado com "/auth", então esta rota será acessível em /auth/...
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Cria um novo utilizador e retorna as suas informações."""
    existing = db.query(models.Usuario).filter(models.Usuario.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")
    
    user_obj = models.Usuario(
        nome=user.nome,
        email=user.email,
        # A senha é hasheada antes de ser salva
        senha=hash_password(user.senha)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

@router.post("/login", response_model=schemas.Token)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Autentica o utilizador e retorna um token de acesso."""
    user = db.query(models.Usuario).filter(models.Usuario.email == req.email).first()
    
    if not user or not verify_password(req.senha, user.senha):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
        
    # Usa o ID do utilizador (ID) como 'subject' (sub) no token
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


# --- NOVO ENDPOINT /users/me ---

@router.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.Usuario = Depends(get_current_user)):
    """
    Obtém informações sobre o utilizador autenticado a partir do token.
    A dependência get_current_user já validou o token e buscou o utilizador.
    """
    # O objeto retornado (current_user) é do tipo models.Usuario, 
    # e o FastAPI o serializa usando o esquema schemas.UserOut,
    # que inclui o campo 'nome'.
    return current_user