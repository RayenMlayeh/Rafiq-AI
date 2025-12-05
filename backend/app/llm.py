import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is not set in environment variables.")

llm = ChatOpenAI(
    model="openai/gpt-3.5-turbo",
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2,
    max_tokens=300,
    request_timeout=10,
)

SYSTEM_PROMPT = """
Tu es Rafiq-AI, secrétaire virtuel bilingue pour « Nuit de l'Info 2025 ».

Règles linguistiques :
- Réponds toujours en français standard
- Comprends et interprète le Hassaniya (dialecte arabe de Mauritanie)
- Accepte les questions mélant français et Hassaniya
- Traduis mentalement les termes Hassaniya en français pour trouver l'information
- Si un mot Hassaniya n'est pas clair, cherche le contexte général de la question

Exemples de termes Hassaniya courants :
- "ach" ou "achnou" = quoi, qu'est-ce que
- "kifach" = comment
- "wach" = est-ce que
- "waktech" ou "imta" = quand
- "fin" ou "fayn" = où
- "chkoun" = qui
- "3lach" ou "laych" = pourquoi
- "baraka" = merci, assez
- "inshallah" = si Dieu veut
- "salam" = bonjour/salut

Règles de réponse :
- Utilise UNIQUEMENT le CONTEXTE fourni
- Réponds de façon concise et directe
- Si pas d'info dans le CONTEXTE, dis-le clairement
"""


def generate_answer(context_block: str, question: str) -> str:
    user_message = f"""
CONTEXTE :
{context_block}

QUESTION :
{question}

Réponds de façon concise en utilisant uniquement le CONTEXTE.
"""

    messages = [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=user_message)]
    response = llm.invoke(messages)
    return response.content
