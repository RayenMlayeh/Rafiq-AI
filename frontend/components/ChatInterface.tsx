import React, { useState, useRef, useEffect } from 'react';
import { Send, Pen } from 'lucide-react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import { sendChatMessage } from '../services/api';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour. Je suis Rafiq-AI, votre secrétaire virtuel. Comment puis-je vous assister aujourd\'hui ?',
      timestamp: Date.now(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    }]);
    setLoading(true);

    try {
      const result = await sendChatMessage(userText);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
        sources: result.sources
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="aged-paper rounded-t-lg border-2 border-vintage-sepia/40 border-b-0 px-6 py-4 shadow-paper brass-corners vintage-stamp">
        <div className="flex items-center justify-between typewriter-ribbon">
          <div>
            <h2 className="font-serif text-xl font-bold text-vintage-charcoal">
              Bureau de Correspondance
            </h2>
            <p className="text-xs font-mono text-vintage-mahogany/70 mt-0.5 tracking-wide">
              COMMUNICATION OFFICIELLE
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-vintage-forest animate-telegraph"></div>
            <span className="text-[10px] font-mono font-semibold text-vintage-forest uppercase tracking-wider animate-neon-glow">
              En ligne
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 aged-paper border-x-2 border-vintage-sepia/40 p-6 overflow-y-auto animate-fade-in">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {loading && (
             <div className="flex justify-start animate-slide-up">
                <div className="paper-texture px-6 py-4 rounded border-2 border-vintage-sepia/40 shadow-paper max-w-xs">
                   <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-vintage-mahogany animate-pulse-glow" style={{animationDelay: '0s'}}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-vintage-mahogany animate-pulse-glow" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-vintage-mahogany animate-pulse-glow" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <span className="text-sm font-typewriter text-vintage-mahogany">Rédaction en cours...</span>
                   </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area - Leather Desk Panel */}
      <div className="rounded-b-lg border-2 border-vintage-sepia/40 bg-gradient-to-b from-vintage-mahogany/20 to-vintage-mahogany/30 p-6 shadow-desk">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            
            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tapez votre message..."
                disabled={loading}
                className="w-full px-5 py-4 paper-texture rounded border-2 border-vintage-sepia/50 shadow-inset-paper
                  font-body text-base text-vintage-ink placeholder:text-vintage-sepia/60
                  focus:outline-none focus:border-vintage-brass focus:ring-4 focus:ring-vintage-brass/20
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Send Button - Fountain Pen Icon */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 group brass-corners
                ${input.trim() && !loading 
                  ? 'bg-vintage-brass text-vintage-cream border-vintage-charcoal/40 shadow-vintage hover:shadow-desk hover:-translate-y-0.5 active:translate-y-0 animate-radio-dial' 
                  : 'bg-vintage-sand/50 text-vintage-sepia border-vintage-sepia/30 cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-vintage-cream/30 border-t-vintage-cream rounded-full animate-spin animate-vintage-flicker"></div>
              ) : (
                <Pen size={20} strokeWidth={2.5} className={input.trim() ? "group-hover:scale-110 transition-transform animate-neon-glow" : ""} />
              )}
            </button>
          </div>
          
          {/* Hint Text */}
          <p className="mt-3 text-center text-[10px] font-mono text-vintage-sepia/80 tracking-wide">
            Conseil : Posez des questions claires pour obtenir les meilleures réponses
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
