import React, { useState } from 'react';
import { generateArtwork } from '../services/geminiService';
import { Artwork } from '../types';
import { Sparkles, Loader2, Plus, Download } from 'lucide-react';

interface GeneratorProps {
  onArtCreated: (art: Artwork) => void;
}

const Generator: React.FC<GeneratorProps> = ({ onArtCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setPreviewUrl(null);
    try {
      const base64Image = await generateArtwork(prompt);
      setPreviewUrl(base64Image);
    } catch (error) {
      alert("Failed to generate art. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToGallery = () => {
    if (previewUrl) {
      const newArt: Artwork = {
        id: Date.now().toString(),
        url: previewUrl,
        title: prompt.length > 20 ? prompt.substring(0, 20) + "..." : prompt,
        artist: "Gemini AI",
        year: new Date().getFullYear().toString(),
        isGenerated: true,
      };
      onArtCreated(newArt);
      setPrompt('');
      setPreviewUrl(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-gold-400 mb-4">The Atelier</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto font-light">
          Commission the AI to create unique masterpieces. Describe your vision in detail—style, mood, lighting, and subject.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-neutral-800">
          <form onSubmit={handleGenerate} className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., An oil painting of a futuristic city in the style of Van Gogh, golden hour lighting..."
              className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-neutral-200 focus:outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600 transition-all resize-none placeholder-neutral-700"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  isGenerating || !prompt.trim()
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-gold-600 hover:bg-gold-500 text-white shadow-lg shadow-gold-900/20'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Art
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="min-h-[400px] bg-neutral-950 flex items-center justify-center p-8 relative">
          {isGenerating ? (
            <div className="text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-neutral-500 font-serif animate-pulse">The AI is painting your vision...</p>
            </div>
          ) : previewUrl ? (
            <div className="relative w-full h-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <img 
                src={previewUrl} 
                alt="Generated Art" 
                className="max-h-[500px] shadow-2xl rounded-sm border-4 border-neutral-800"
              />
              <div className="mt-8 flex gap-4">
                 <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = previewUrl;
                    link.download = `lumina-art-${Date.now()}.png`;
                    link.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleSaveToGallery}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add to Gallery
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-neutral-600">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-light">Your masterpiece will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;