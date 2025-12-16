export interface Artwork {
  id: string;
  url: string;
  title: string;
  artist: string;
  year: string;
  description?: string;
  isGenerated?: boolean;
}

export interface AnalysisResult {
  title: string;
  critique: string;
  mood: string;
  style: string;
}

export enum ViewState {
  GALLERY = 'GALLERY',
  ATELIER = 'ATELIER', // The generator
  ABOUT = 'ABOUT'
}