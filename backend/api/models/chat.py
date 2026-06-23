"""
Pydantic models for chat API.
"""
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request model for POST /api/chat."""
    message: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="User message"
    )


class Source(BaseModel):
    """Single citation source."""
    title: str
    url: str


class ChatResponse(BaseModel):
    """Response model for POST /api/chat."""
    answer: str
    sources: list[Source] = []


class HealthResponse(BaseModel):
    """Response model for GET /api/health."""
    status: str = "ok"


class StatusResponse(BaseModel):
    """Response model for GET /api/status."""
    status: str
    version: str
    rag: bool = False
    llm: bool = False
    vectordb: bool = False
