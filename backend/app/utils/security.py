from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "troque_por_uma_chave_secreta_forte"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """
    Gera hash seguro usando bcrypt.
    Mantém truncamento manual de 72 bytes,
    mas NÃO passa bytes para o Passlib,
    porque o Passlib já faz isso internamente.
    """

    # 1 — converter para bytes
    raw_bytes = password.encode("utf-8")

    # 2 — truncar para os 72 bytes permitidos pelo bcrypt
    if len(raw_bytes) > 72:
        raw_bytes = raw_bytes[:72]

    # 3 — converter de volta para string para o Passlib trabalhar corretamente
    #     (Passlib gera os bytes internamente no backend certo)
    safe_password = raw_bytes.decode("utf-8", errors="ignore")

    # 4 — gerar hash
    return pwd_context.hash(safe_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica senha.
    Usamos o mesmo esquema: truncar e passar string normal
    para o Passlib; ele converte internamente.
    """

    raw_bytes = plain_password.encode("utf-8")

    if len(raw_bytes) > 72:
        raw_bytes = raw_bytes[:72]

    safe_password = raw_bytes.decode("utf-8", errors="ignore")

    return pwd_context.verify(safe_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Gera token JWT válido por 7 dias.
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + (
        expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Compatibilidade
get_password_hash = hash_password
