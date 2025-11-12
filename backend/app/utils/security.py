from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# --- Configuração ---
# ajuste sua SECRET_KEY e ALGORITHM
SECRET_KEY = "troque_por_uma_chave_secreta_forte"
ALGORITHM = "HS256"
# 7 dias para expiração do token (60 minutos * 24 horas * 7 dias)
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 

# Configuração do Contexto de Hashing
# Recomendado usar o esquema "bcrypt"
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# --- Funções de Segurança ---

def hash_password(password: str) -> str:
    """
    Realiza o hash de uma senha, garantindo o truncamento para 72 bytes
    conforme exigido pelo bcrypt.
    """
    # 1. Codifica a string em BYTES
    password_bytes = password.encode("utf-8")
    
    # 2. TRUNCAMENTO: Limita o tamanho a 72 bytes
    # A Passlib/Bcrypt exige que a entrada NUNCA exceda 72 bytes.
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        
    # 3. Passa os BYTES truncados para o hash.
    # Esta linha utiliza os bytes truncados, resolvendo o ValueError.
    return pwd_context.hash(password_bytes)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se uma senha em texto puro corresponde ao hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Cria um JSON Web Token (JWT) de acesso."""
    to_encode = data.copy()
    
    # Define o tempo de expiração ('exp')
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    
    # Codifica o token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt