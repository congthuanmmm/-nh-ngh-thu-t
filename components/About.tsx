import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-serif text-gold-400 mb-8">About Lumina</h1>
      <div className="space-y-6 text-lg text-neutral-400 font-light leading-relaxed">
        <p>
          <strong className="text-white">Lumina Gallery</strong> represents the intersection of classical aesthetics and modern artificial intelligence.
        </p>
        <p>
          Our <span className="text-gold-500">Curator</span> utilizes advanced Gemini Vision models to analyze art in real-time, offering critiques that rival human experts.
        </p>
        <p>
          Our <span className="text-gold-500">Atelier</span> empowers you to become the artist. Using state-of-the-art generative models, your words are transformed into visual reality instantly.
        </p>
        <div className="mt-12 pt-12 border-t border-neutral-800">
          <p className="text-sm text-neutral-600">Powered by Google Gemini API</p>
        </div>
      </div>
    </div>
  );
};

export default About;