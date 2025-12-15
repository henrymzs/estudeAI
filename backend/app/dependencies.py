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
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # LOG 1: Tenta decodificar o token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        # LOG 2: Verifica o ID extraído
        print(f"DEBUG_AUTH: Token decodificado. ID do Usuário (sub): {user_id}")
        
        if user_id is None:
            print("DEBUG_AUTH: Falha - ID do usuário é None.")
            raise credentials_exception
            
    except JWTError:
        # LOG 3: ERRO de decodificação (Chave errada ou expiração)
        print("DEBUG_AUTH: Falha - JWTError (Chave Incorreta/Token Expirado).")
        raise credentials_exception
        
    # Consulta o usuário no banco de dados
    from app.models import Usuario
    user = db.query(Usuario).filter(Usuario.id == int(user_id)).first()
    
    if user is None:
        # LOG 4: ERRO de DB (Usuário não existe)
        print(f"DEBUG_AUTH: Falha - Usuário com ID {user_id} não encontrado no DB.")
        raise credentials_exception
        
    print(f"DEBUG_AUTH: Sucesso. Usuário {user.nome} autenticado.")
    return user