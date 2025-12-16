import React from 'react';
import { ViewState } from '../types';
import { Palette, Brush, Info } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: ViewState.GALLERY, label: 'Gallery', icon: Palette },
    { id: ViewState.ATELIER, label: 'Atelier (Create)', icon: Brush },
    { id: ViewState.ABOUT, label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange(ViewState.GALLERY)}>
            <div className="w-8 h-8 bg-gradient-to-tr from-gold-400 to-gold-600 rounded-sm transform rotate-45 shadow-lg shadow-gold-900/50"></div>
            <span className="text-2xl font-serif text-white tracking-wider">LUMINA</span>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentView === item.id
                      ? 'text-gold-400 bg-neutral-800'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;