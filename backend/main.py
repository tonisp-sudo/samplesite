"""
MLA Knowledge Assistant — FastAPI Backend
Entry point for the application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.chat import router as chat_router

app = FastAPI(
    title="MLA Knowledge Assistant API",
    description="Backend for MLA chatbot",
    version="0.1.0"
)

# CORS — allow local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "MLA Knowledge Assistant API"}
