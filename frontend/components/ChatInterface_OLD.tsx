import React, { useState, useRef, useEffect } from 'react';
import { Send, Hexagon } from 'lucide-react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import { sendChatMessage } from '../services/api';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Salut ! Je suis Rafiq-AI. Je connais tout sur le village (et les sangliers).',
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
        content: "Le ciel nous tombe sur la tête ! (Erreur)",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-stone-dark shadow-comic overflow-hidden relative">
      
      {/* Hut Interior Header */}
      <div className="h-14 border-b-2 border-stone-dark flex items-center justify-between px-6 bg-primary-dark text-bg-parchment relative overflow-hidden">
        {/* Roof Beams Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#000_20px,#000_22px)]"></div>
        
        <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-stone-dark border-2 border-accent-gold flex items-center justify-center">
                <span className="font-display text-accent-gold">R</span>
            </div>
            <div>
                <h3 className="font-display tracking-wide leading-none">La Hutte</h3>
                <span className="text-[10px] uppercase font-bold text-accent-gold opacity-80">En direct</span>
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-bg-parchment scroll-smooth relative">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-12">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {loading && (
             <div className="flex justify-start animate-bounce-in">
                <div className="bg-white px-5 py-3 rounded-2xl rounded-tl-none border-2 border-stone-300 shadow-sm flex items-center gap-3">
                   {/* Hammer Animation */}
                   <div className="animate-wobble">
                      <Hexagon size={20} className="text-stone-500" fill="currentColor" />
                   </div>
                   <span className="text-sm font-bold text-stone-500 font-hand text-lg">Gravure en cours...</span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area - Wooden Plank Style */}
      <div className="p-4 bg-bg-wood border-t-2 border-stone-dark relative shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex gap-3 items-center z-10">
            <div className="flex-1 relative group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pose ta question (par Bélénos)..."
                    disabled={loading}
                    className="w-full h-14 pl-6 pr-16 rounded-xl border-2 border-stone-dark bg-white text-stone-900 placeholder:text-stone-400 font-bold focus:outline-none focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/30 transition-all shadow-inner-depth"
                />
                
                {/* Send Button - Horn/Stone */}
                <div className="absolute right-2 top-2 bottom-2">
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`
                            h-10 w-12 rounded-lg flex items-center justify-center transition-all duration-200 border-2 border-stone-dark
                            ${input.trim() && !loading 
                                ? 'bg-accent-gold text-stone-900 hover:scale-110 hover:rotate-6 shadow-comic-sm hover:bg-yellow-400' 
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed border-transparent'
                            }
                        `}
                    >
                        <Send size={20} strokeWidth={3} className={input.trim() ? "ml-0.5" : ""} />
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;