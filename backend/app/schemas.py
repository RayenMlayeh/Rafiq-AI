from pydantic import BaseModel
from typing import List


class KnowledgeBaseInput(BaseModel):
    text: str
    reset: bool = False


class ChatRequest(BaseModel):
    question: str


class UsedContextItem(BaseModel):
    index: int
    text: str
    score: float


class ChatResponse(BaseModel):
    answer: str
    used_context: List[UsedContextItem]
