from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# --- 1. MODELOS PYDANTIC (Estruturas de Dados) ---

# Schema base para criação/leitura (o que o utilizador submete)
class UserBase(BaseModel):
    # O email será o identificador único
    email: str
    # 'nome' será o campo usado para a saudação no frontend
    nome: str = Field(..., description="Nome completo ou de exibição do utilizador.")

# Schema para criação de utilizador (adiciona a password)
class UserCreate(UserBase):
    password: str

# Schema para o modelo de Utilizador retornado pela API (omite a password)
class User(UserBase):
    id: int
    is_active: bool = True
    
    # Configuração para permitir mapeamento de ORM (se usar SQLAlchemy)
    class Config:
        from_attributes = True

# --- 2. SIMULAÇÃO DE BASE DE DADOS E DEPENDÊNCIAS DE AUTENTICAÇÃO ---

# Simulação da "Base de Dados" de utilizadores
fake_users_db: Dict[int, User] = {
    1: User(id=1, nome="João Silva", email="joao.silva@exemplo.com"),
    2: User(id=2, nome="Maria Sousa", email="maria.sousa@exemplo.com"),
}
next_user_id = 3

# Dependência simulada: Esta função simula a verificação do token
# e retorna o objeto do utilizador autenticado.
async def get_current_user():
    """
    Simula a obtenção do utilizador autenticado através de um token Bearer.
    Na realidade, aqui haveria a lógica de decodificação de JWT.
    """
    # Para testes, retornamos o primeiro utilizador da base de dados fake.
    # Isto garante que o frontend recebe um nome real em /users/me
    if 1 in fake_users_db:
        return fake_users_db[1]
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

# --- 3. ROTAS DO FASTAPI ---

router = APIRouter(
    prefix="/users",
    tags=["Utilizadores"],
)

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    """Registar um novo utilizador."""
    global next_user_id
    
    # Simulação: Verificar se o email já existe
    if any(u.email == user.email for u in fake_users_db.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O email já está registado."
        )
        
    # Simulação: Criar o novo utilizador (sem hash da password)
    new_user = User(
        id=next_user_id,
        email=user.email,
        nome=user.nome,
        is_active=True
    )
    fake_users_db[next_user_id] = new_user
    next_user_id += 1
    
    return new_user

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Obter os dados do utilizador autenticado.
    Esta é a rota que o seu frontend está a chamar para obter o nome.
    """
    # Retorna o objeto User completo (que contém o campo 'nome')
    return current_user

@router.get("/", response_model=List[User])
async def read_users(skip: int = 0, limit: int = 10):
    """Listar todos os utilizadores (apenas para administração/debug)."""
    return list(fake_users_db.values())[skip : skip + limit]

# Exemplo de como incluir este router no seu ficheiro principal (main.py):
"""
from fastapi import FastAPI
from .usuarios import router as user_router
from .decks import router as deck_router # Assumindo que tem outro ficheiro para decks

app = FastAPI()
app.include_router(user_router)
app.include_router(deck_router)
"""