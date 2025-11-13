from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, deck, flashcard

app = FastAPI()

origins = [
    "http://localhost:19000",
    "http://localhost:8081",
    "exp://127.0.0.1:19000",
    "http://10.105.187.105:8000",
    # adicione o origin do seu app expo / mobile
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
