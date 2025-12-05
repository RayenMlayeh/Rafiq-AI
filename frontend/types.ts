export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: string[];
}

export interface KnowledgeResponse {
  success: boolean;
  message: string;
}

export interface ChatResponse {
  response: string;
  sources?: string[]; // Optional paragraphs used
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}