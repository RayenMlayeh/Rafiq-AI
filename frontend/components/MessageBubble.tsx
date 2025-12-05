import React, { useState } from 'react';
import { User, Mail, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-slide-up`}>
      <div className={`flex max-w-[85%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-vintage mt-1 transform transition-transform hover:scale-110
            ${isUser 
              ? 'bg-gradient-to-br from-vintage-forest to-vintage-forest/80 border-vintage-charcoal/30' 
              : 'bg-gradient-to-br from-retro-bronze to-retro-copper border-vintage-charcoal/30'
            }
        `}>
            {isUser ? (
              <User size={18} className="text-vintage-cream" strokeWidth={2.5} />
            ) : (
              <Mail size={18} className="text-vintage-cream" strokeWidth={2.5} />
            )}
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
            <div className={`flex items-center gap-2 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] font-mono font-semibold text-vintage-mahogany/70 uppercase tracking-widest">
                    {isUser ? 'Vous' : 'Rafiq-AI'}
                </span>
                <div className="w-1 h-1 rounded-full bg-vintage-sepia/50"></div>
                <span className="text-[9px] font-mono text-vintage-sepia/60">
                    {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            <div 
                className={`relative px-6 py-4 border-2 shadow-paper transition-all duration-200 hover:shadow-vintage animate-ink-fade animate-page-turn ink-splotch
                ${isUser 
                    ? 'paper-texture border-vintage-forest/40 rounded-2xl rounded-tr-none vintage-stamp' 
                    : 'aged-paper border-vintage-sepia/40 rounded-2xl rounded-tl-none'
                }
                `}
            >
                <p className={`whitespace-pre-wrap leading-relaxed ${isUser ? 'font-body text-base text-vintage-ink' : 'font-body text-base text-vintage-charcoal'}`}>
                  {message.content}
                </p>
                <div className={`absolute ${isUser ? '-top-1 -right-1' : '-top-1 -left-1'} w-3 h-3 bg-vintage-sand border-l border-b ${isUser ? 'border-vintage-forest/40' : 'border-vintage-sepia/40'} transform rotate-45`}></div>
            </div>

            {!isUser && message.sources && message.sources.length > 0 && (
                <div className="mt-2 ml-2 animate-drawer-slide">
                    <button 
                        onClick={() => setShowSources(!showSources)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-vintage-mahogany 
                          bg-vintage-mahogany/10 hover:bg-vintage-mahogany/20 
                          border-2 border-vintage-mahogany/30 hover:border-vintage-mahogany/50 
                          rounded transition-all duration-200 hover:shadow-paper brass-corners"
                    >
                        <FileText size={14} />
                        <span>{showSources ? 'Fermer' : 'Consulter'} les sources ({message.sources.length})</span>
                        {showSources ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    
                    {showSources && (
                        <div className="mt-3 animate-slide-up animate-page-turn">
                          <div className="bg-gradient-to-b from-vintage-mahogany/15 to-vintage-mahogany/25 border-2 border-vintage-mahogany/40 rounded-lg p-1 shadow-vintage vintage-stamp">
                            <div className="paper-texture rounded p-4 space-y-2.5">
                                {message.sources.map((src, i) => {
                                    const match = src.match(/^\[§(\d+)\]\s*(.*)$/);
                                    const paraNum = match ? match[1] : (i + 1);
                                    const text = match ? match[2] : src;
                                    
                                    return (
                                        <div key={i} className="flex gap-3 border-b border-vintage-sepia/30 last:border-0 pb-2.5 last:pb-0">
                                          <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-vintage-brass/20 border border-vintage-brass/40 rounded text-xs font-mono font-bold text-vintage-mahogany">
                                            {paraNum}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-typewriter text-vintage-mahogany leading-relaxed break-words">
                                              {text}
                                            </p>
                                          </div>
                                        </div>
                                    );
                                })}
                            </div>
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
