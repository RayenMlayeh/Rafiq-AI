import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

const VINTAGE_TIPS = [
  "📋 Conseil du bureau : ne renversez pas votre café sur la base de données.",
  "💡 Astuce vintage : pensez à éteindre la lampe avant de partir.",
  "📝 Note du secrétaire : vos requêtes seront traitées en ordre d'arrivée.",
  "⏰ Rappel : les archives ferment au coucher du soleil.",
  "🔖 Mémo : gardez vos fiches classées par ordre alphabétique.",
];

const Header: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % VINTAGE_TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b-2 border-vintage-sepia/30 bg-vintage-paper shadow-vintage brass-corners">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-6 gap-4 typewriter-ribbon">
          <div className="flex items-center gap-4 animate-neon-glow">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-retro-gold via-retro-copper to-retro-bronze rounded-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative bg-gradient-to-br from-retro-bronze to-retro-copper p-3 rounded-lg border-2 border-vintage-charcoal/20 shadow-desk">
                <FileText size={28} className="text-vintage-cream" strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="flex flex-col">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-vintage-charcoal text-vintage-shadow tracking-tight">
                Rafiq-AI
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono font-medium text-vintage-mahogany uppercase tracking-[0.15em] opacity-80">
                  Secrétaire Virtuel
                </span>
                <span className="w-1 h-1 rounded-full bg-vintage-brass animate-pulse-glow"></span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block max-w-md">
            <div className="relative group">
              <div className="aged-paper px-4 py-2.5 rounded border-2 border-vintage-sepia/40 shadow-paper transform hover:scale-105 transition-transform duration-200">
                <p className="text-xs font-typewriter text-vintage-mahogany text-center leading-relaxed animate-ink-fade">
                  {VINTAGE_TIPS[tipIndex]}
                </p>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-vintage-sand border-l border-b border-vintage-sepia/40 transform rotate-45"></div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-vintage-mahogany/10 border border-vintage-mahogany/30 rounded-full">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-vintage-brass"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-vintage-brass animate-pulse-glow"></div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-vintage-mahogany uppercase tracking-wider">
              Nuit de l'Info 2025
            </span>
          </div>
        </div>
        
      </div>
      
      {/* Decorative Border Strip */}
      <div className="h-1 bg-gradient-to-r from-transparent via-vintage-brass to-transparent opacity-50"></div>
    </header>
  );
};

export default Header;