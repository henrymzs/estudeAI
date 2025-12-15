from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app.schemas import UserCreate, UserOut, LoginRequest, Token
from app.models import Usuario
from app.database import get_db
from app.dependencies import get_current_user
from app.utils.security import (
    verify_password,
    get_password_hash,
    create_access_token
)

router = APIRouter(
    prefix="/users",
    tags=["Usuários"]
)


# =========================
#   REGISTAR USUÁRIO
# =========================
@router.post("/", response_model=UserOut, status_code=201)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    # Verifica se email já existe
    existe = db.query(Usuario).filter(Usuario.email == user.email).first()
    if existe:
        raise HTTPException(
            status_code=400,
            detail="O email já está registado."
        )

    # Cria usuário com hash de senha
    novo = Usuario(
        nome=user.nome,
        email=user.email,
        senha=get_password_hash(user.senha)
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    return novo


# =========================
#   LOGIN / GERAR TOKEN
# =========================
@router.post("/login", response_model=Token)
def login(form: LoginRequest, db: Session = Depends(get_db)):

    usuario = db.query(Usuario).filter(Usuario.email == form.email).first()

    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciais inválidas")

    if not verify_password(form.senha, usuario.senha):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")

    # Criar token JWT
    access_token = create_access_token(
        data={"sub": str(usuario.id)},
        expires_delta=timedelta(hours=4)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================
#  ROTA /me — USUÁRIO LOGADO
# =========================
@router.get("/me", response_model=UserOut)
def read_users_me(current_user: Usuario = Depends(get_current_user)):
    return current_user


# =========================
#  LISTAR USUÁRIOS (debug)
# =========================
@router.get("/", response_model=list[UserOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()
