import React, { useEffect, useState } from 'react';
import { Artwork, AnalysisResult } from '../types';
import { X, Sparkles, Loader2, Quote } from 'lucide-react';
import { analyzeArtwork, urlToBase64 } from '../services/geminiService';

interface ArtModalProps {
  artwork: Artwork;
  onClose: () => void;
}

const ArtModal: React.FC<ArtModalProps> = ({ artwork, onClose }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const analyze = async () => {
      setLoading(true);
      try {
        // If it's a generated image, it's already a data URL, we just strip the prefix
        // If it's a URL, we fetch and convert
        let base64 = '';
        if (artwork.url.startsWith('data:')) {
          base64 = artwork.url.split(',')[1];
        } else {
          base64 = await urlToBase64(artwork.url);
        }

        const result = await analyzeArtwork(base64);
        if (isMounted) {
          setAnalysis(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    analyze();

    return () => { isMounted = false; };
  }, [artwork]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 bg-neutral-950 flex items-center justify-center p-4 md:p-8 relative">
           <img 
            src={artwork.url} 
            alt="Artwork" 
            className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto bg-neutral-900 border-l border-neutral-800 flex flex-col">
          <div className="mb-6">
             <h2 className="text-3xl font-serif text-gold-400 mb-2">{analysis?.title || "Analyzing..."}</h2>
             <p className="text-neutral-400 italic font-serif">{artwork.artist}, {artwork.year}</p>
          </div>

          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-neutral-500 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                <p className="text-sm font-light tracking-wide">The Curator is studying the piece...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                
                {/* Critique */}
                <div className="relative p-6 bg-neutral-800/30 rounded-lg border border-neutral-800/50">
                   <Quote className="absolute top-4 left-4 w-6 h-6 text-gold-700/30" />
                   <p className="text-neutral-300 leading-relaxed font-light indent-6 relative z-10">
                     {analysis.critique}
                   </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-800/20 border border-neutral-800">
                    <span className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">Mood</span>
                    <span className="text-gold-300 font-medium">{analysis.mood}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-800/20 border border-neutral-800">
                    <span className="block text-xs uppercase tracking-widest text-neutral-500 mb-1">Style</span>
                    <span className="text-gold-300 font-medium">{analysis.style}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-600 mt-8 pt-6 border-t border-neutral-800">
                  <Sparkles className="w-3 h-3" />
                  <span>Analysis provided by Gemini Vision AI</span>
                </div>
              </div>
            ) : (
              <p className="text-red-400">Analysis unavailable.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtModal;