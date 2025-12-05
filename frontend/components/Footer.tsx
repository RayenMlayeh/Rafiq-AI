import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto border-t-2 border-vintage-sepia/30 bg-vintage-paper brass-corners">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 typewriter-ribbon">
          
          {/* Copyright - Vintage Manual Style */}
          <div className="flex items-center gap-3">
            <div className="w-px h-6 bg-vintage-sepia/40"></div>
            <span className="text-[11px] font-mono text-vintage-mahogany/70 tracking-wide animate-typewriter">
              © 2025 Rafiq-AI — Tous droits réservés
            </span>
            <div className="w-px h-6 bg-vintage-sepia/40"></div>
          </div>
          
          {/* Event Badge */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-typewriter font-bold text-vintage-mahogany uppercase tracking-[0.15em]">
              Défi National Nuit de l'Info
            </span>
            <div className="px-2 py-1 bg-vintage-brass/10 border border-vintage-brass/30 rounded text-[9px] font-mono font-semibold text-vintage-brass vintage-stamp animate-neon-glow">
              2025
            </div>
          </div>
        </div>
        
        {/* Decorative Line */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-vintage-sepia/30 to-transparent"></div>
      </div>
    </footer>
  );
};

export default Footer;