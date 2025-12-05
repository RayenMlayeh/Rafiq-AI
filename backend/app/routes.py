from fastapi import APIRouter
from .rag import KnowledgeBase, MIN_SCORE
from .schemas import KnowledgeBaseInput, ChatRequest, ChatResponse, UsedContextItem
from .llm import generate_answer

router = APIRouter()
kb = KnowledgeBase(auto_load=True)


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/knowledge-base")
def update_knowledge_base(payload: KnowledgeBaseInput):
    if payload.reset:
        kb.reset()
        kb.load_from_json()
    
    kb.ingest(payload.text, merge=True)
    kb.save_to_json()
    
    return {"status": "ok", "paragraphs_count": len(kb.paragraphs)}


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if kb.is_empty():
        return ChatResponse(
            answer="La base de connaissances est vide. Merci d'ajouter un texte de référence avant de poser des questions.",
            used_context=[]
        )

    matches = kb.retrieve(request.question, top_k=3, use_expansion=False)
    
    if not matches or matches[0]["score"] < MIN_SCORE:
        return ChatResponse(
            answer="Je n'ai pas assez d'informations dans la base de connaissances pour répondre précisément à cette question.",
            used_context=[]
        )

    context_lines = []
    for m in matches[:3]:
        text = m['text'][:400] + ('...' if len(m['text']) > 400 else '')
        if 'metadata' in m and 'titre' in m['metadata']:
            context_line = f"[{m['index']}] {m['metadata']['titre']}: {text}"
        else:
            context_line = f"[{m['index']}] {text}"
        context_lines.append(context_line)
    
    context_block = "\n\n".join(context_lines)
    answer_text = generate_answer(context_block, request.question)
    used_context_items = [UsedContextItem(index=m["index"], text=m["text"], score=m["score"]) for m in matches]

    return ChatResponse(answer=answer_text, used_context=used_context_items)


@router.get("/knowledge-base/stats")
def get_knowledge_base_stats():
    """
    Get statistics about the current knowledge base.
    
    Returns:
        Statistics including paragraph count, tags, etc.
    """
    return kb.get_statistics()
