import React, { useState } from 'react';
import { FileText, Loader2, Check, AlertCircle } from 'lucide-react';
import { updateKnowledgeBase } from '../services/api';
import { LoadingState } from '../types';

const KnowledgePanel: React.FC = () => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setStatus(LoadingState.LOADING);
    try {
      const result = await updateKnowledgeBase(text);
      console.log('Knowledge base update result:', result);
      setStatus(LoadingState.SUCCESS);
      setText('');
      setTimeout(() => setStatus(LoadingState.IDLE), 3500);
    } catch (error) {
      console.error('Knowledge base update error:', error);
      setStatus(LoadingState.ERROR);
      setTimeout(() => setStatus(LoadingState.IDLE), 3500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="aged-paper rounded-t-lg border-2 border-vintage-sepia/40 border-b-0 px-6 py-4 shadow-paper vintage-stamp brass-corners">
        <div className="flex items-center gap-3 typewriter-ribbon">
          <div className="p-2 bg-gradient-to-br from-retro-bronze to-retro-copper rounded border-2 border-vintage-mahogany/20 shadow-vintage transform -rotate-2">
            <FileText size={20} className="text-vintage-cream" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-vintage-charcoal">
              📜 Ajouter une Base de Connaissances
            </h2>
            <p className="text-xs font-mono text-vintage-mahogany/70 mt-0.5 tracking-wide">
              ARCHIVES DÉPARTEMENTALES
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 aged-paper border-2 border-vintage-sepia/40 rounded-b-lg shadow-vintage p-6 flex flex-col gap-6 relative overflow-hidden">
        {status === LoadingState.SUCCESS && (
          <div className="absolute z-20 top-8 right-8 animate-stamp wax-seal-decoration">
             <div className="relative transform -rotate-12 animate-envelope-fold">
                <div className="border-4 border-vintage-burgundy/60 rounded-lg p-3 bg-vintage-burgundy/10 postmark">
                  <Check size={32} className="text-vintage-burgundy" strokeWidth={3} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-typewriter text-xs font-bold text-vintage-burgundy uppercase tracking-widest opacity-90">
                    Archivé
                  </span>
                </div>
             </div>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-3">
          <label className="text-xs font-mono font-semibold text-vintage-mahogany uppercase tracking-[0.1em] flex items-center gap-2">
            Document à archiver
            <span className="px-2 py-0.5 bg-vintage-burgundy/10 text-vintage-burgundy text-[9px] rounded border border-vintage-burgundy/30">
              CONFIDENTIEL
            </span>
          </label>
          <div className="flex-1 relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tapez votre texte à la machine à écrire..."
              className="w-full h-full p-5 paper-texture rounded border-2 border-vintage-sepia/50 shadow-inset-paper
                font-typewriter text-base text-vintage-ink placeholder:text-vintage-sepia
                focus:outline-none focus:border-vintage-brass focus:ring-4 focus:ring-vintage-brass/20
                transition-all resize-none leading-relaxed
                hover:border-vintage-sepia group-hover:shadow-paper animate-paper-rustle"
            />
            {text && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-vintage-ink animate-pulse-glow"></div>
                <span className="text-[10px] font-mono text-vintage-ink">
                  {text.length} caractères
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || status === LoadingState.LOADING}
            className={`
              w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-serif text-lg font-semibold tracking-wide
              border-2 transition-all duration-200 relative overflow-hidden
              ${!text.trim() || status === LoadingState.LOADING 
                ? 'bg-vintage-sand/50 text-vintage-sepia border-vintage-sepia/30 cursor-not-allowed' 
                : 'bg-vintage-mahogany text-vintage-cream border-vintage-charcoal/40 shadow-vintage hover:shadow-desk hover:-translate-y-0.5 active:translate-y-0 active:shadow-paper'
              }
            `}
          >
            {status === LoadingState.LOADING ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="font-typewriter text-sm tracking-wider">Enregistrement...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19l-7 -7l7 -7M5 12h14" />
                </svg>
                <span>ENREGISTRER</span>
              </>
            )}
          </button>
          
          {status === LoadingState.ERROR && (
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-vintage-burgundy/10 border-2 border-vintage-burgundy/40 rounded">
               <AlertCircle size={16} className="text-vintage-burgundy" />
               <span className="text-sm font-typewriter text-vintage-burgundy">Erreur d'archivage</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgePanel;