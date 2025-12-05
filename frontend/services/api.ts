import { KnowledgeResponse, ChatResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Sends the knowledge base text to the backend.
 */
export const updateKnowledgeBase = async (text: string): Promise<KnowledgeResponse> => {
  const response = await fetch(`${API_BASE}/knowledge-base`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();
  return { 
    success: data.status === 'ok',
    message: `Savoir gravé ! ${data.paragraphs_count} paragraphes ajoutés.`
  };
};

/**
 * Sends a chat message to the backend.
 */
export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: message }),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  const data = await response.json();
  return { 
    response: data.answer,
    sources: data.used_context?.map((ctx: any) => `[§${ctx.index + 1}] ${ctx.text.substring(0, 100)}`) || []
  };
};