from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer # <-- Importação necessária
from sqlalchemy.orm import Session
from jose import jwt, JWTError

# Importações necessárias (Ajuste conforme seus arquivos)
from app.database import get_db
from app.utils.security import SECRET_KEY, ALGORITHM 
from app.models import Usuario

# CORREÇÃO CRÍTICA: Definir a variável ANTES de usá-la
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Decodifica o token JWT e retorna o objeto Usuário correspondente.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Tenta decodificar o token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
        
    # Consulta o usuário no banco de dados
    from app.models import Usuario # Importação local para evitar ciclos
    user = db.query(Usuario).filter(Usuario.id == int(user_id)).first()
    
    if user is None:
        raise credentials_exception
        
    return user