from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, deck, flashcard, progresso, usuarios

app = FastAPI()

origins = [
    "http://localhost:19000",
    "http://localhost:8081",
    "http://10.105.187.105:8081",
    "exp://10.105.187.105:8081",
    # se o Expo mudar o IP, só adicionar aqui
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(deck.router)
app.include_router(flashcard.router)
app.include_router(usuarios.router)
app.include_router(progresso.router)

