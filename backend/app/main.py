from fastapi import FastAPI
from app.routers import auth

app = FastAPI(
    title="EstudeAI API",
    description="API mínima para testes",
    version="1.0.0"
)

app.include_router(auth.router)
@app.get("/")
def root():
    return {"message": "API EstudeAI rodando!"}
