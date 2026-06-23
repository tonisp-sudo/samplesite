"""
Chat API routes.
"""
from fastapi import APIRouter, HTTPException

from api.models.chat import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    StatusResponse,
    Source,
)

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """
    Process a chat message and return a response.
    
    Currently returns mock data. RAG pipeline will be added later.
    """
    message = request.message.strip()

    # Mock response — replace with RAG pipeline later
    answer = f"Echo: {message}"
    sources: list[Source] = []

    return ChatResponse(answer=answer, sources=sources)


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="ok")


@router.get("/status", response_model=StatusResponse)
def status() -> StatusResponse:
    """System status endpoint."""
    return StatusResponse(
        status="running",
        version="0.1.0",
        rag=False,
        llm=False,
        vectordb=False,
    )
