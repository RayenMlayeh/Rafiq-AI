import React, { useState } from 'react';
import { Message } from '../types';
import { User, Feather, ChevronDown, ChevronUp, Book } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group animate-bounce-in`}>
      
      {/* Visual "POOF" effect decoration (CSS only) */}
      <div className={`text-[10px] font-bold text-stone-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isUser ? 'mr-2' : 'ml-2'}`}>
        {isUser ? 'PLOP !' : 'POUF !'}
      </div>

      <div className={`flex max-w-[90%] md:max-w-[85%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`shrink-0 h-10 w-10 rounded-xl border-2 border-stone-dark flex items-center justify-center shadow-comic-sm mt-1 transform transition-transform group-hover:scale-110
            ${isUser ? 'bg-accent-blue text-white rotate-3' : 'bg-stone-200 text-stone-600 -rotate-3'}
        `}>
            {isUser ? <User size={20} strokeWidth={3} /> : <Feather size={20} strokeWidth={3} />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 px-1">
                <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
                    {isUser ? 'Toi' : 'Rafiq'}
                </span>
            </div>

            <div 
                className={`relative px-6 py-4 border-2 border-stone-dark shadow-comic transition-transform hover:-translate-y-0.5
                ${isUser 
                    ? 'bg-white text-stone-900 rounded-2xl rounded-tr-none font-hand text-xl' 
                    : 'bg-stone-100 text-stone-800 rounded-2xl rounded-tl-none font-sans font-medium'
                }
                `}
            >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                
                {/* Comic Shine Highlight */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>

            {/* Sources Accordion (Only AI) */}
            {!isUser && message.sources && message.sources.length > 0 && (
                <div className="mt-2 ml-2">
                    <button 
                        onClick={() => setShowSources(!showSources)}
                        className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors bg-bg-parchment px-3 py-1.5 rounded-lg border-2 border-stone-300 border-dashed hover:border-solid hover:border-primary hover:scale-105 transform duration-200"
                    >
                        <Book size={14} />
                        {showSources ? 'Fermer le coffre' : `${message.sources.length} sources trouvées`}
                        {showSources ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    
                    {showSources && (
                        <div className="mt-2 bg-[#5D4037] p-1 rounded-lg border-2 border-stone-dark shadow-sm animate-pop origin-top">
                            <div className="bg-bg-parchment rounded border border-[#3E2723] p-2 space-y-1">
                                {message.sources.map((src, i) => {
                                    // Extract paragraph number if present
                                    const match = src.match(/^\[§(\d+)\]\s*(.*)$/);
                                    const paraNum = match ? match[1] : (i + 1);
                                    const text = match ? match[2] : src;
                                    
                                    return (
                                        <div key={i} className="text-xs font-hand font-bold text-[#5D4037] flex gap-2 border-b border-stone-200 last:border-0 pb-1 last:pb-0">
                                            <span className="text-accent-gold shrink-0 font-display">§{paraNum}</span>
                                            <span className="flex-1">{text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;