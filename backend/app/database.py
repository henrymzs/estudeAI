from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexão com MySQL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:266322%40Ry@localhost:3306/estudeai_app"

# Criar engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

# Sessão local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base = declarative_base()

# Dependência para usar sessão no FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
