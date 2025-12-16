import React from 'react';
import { Artwork } from '../types';
import { Maximize2 } from 'lucide-react';

interface GalleryProps {
  artworks: Artwork[];
  onArtworkClick: (art: Artwork) => void;
}

const Gallery: React.FC<GalleryProps> = ({ artworks, onArtworkClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((art) => (
          <div 
            key={art.id} 
            className="group relative aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden cursor-pointer shadow-lg hover:shadow-gold-900/10 transition-all duration-500"
            onClick={() => onArtworkClick(art)}
          >
            <img 
              src={art.url} 
              alt={art.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-gold-400 font-serif text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{art.title}</p>
              <p className="text-neutral-300 text-sm font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{art.artist}</p>
              
              <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform rotate-45 group-hover:rotate-0">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {artworks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-500 font-serif text-xl">The gallery is currently empty.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;