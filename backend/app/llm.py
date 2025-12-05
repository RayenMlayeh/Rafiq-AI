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
Tu es Rafiq-AI, secrétaire virtuel pour « Nuit de l'Info 2025 ».

Règles :
- Réponds en français, comprends le hassaniya
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
