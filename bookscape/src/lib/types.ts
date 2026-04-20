export type Genre = 'Romance' | 'Fantasy' | 'Thriller/Mystery' | 'Dystopian' | 'Historical/Mythological' | 'Melancholic';

export interface EnvironmentScene {
  setting: string; // e.g., "magical castle", "dark forest", "dystopian city"
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  weather: 'clear' | 'cloudy' | 'rainy' | 'foggy' | 'stormy' | 'snowy';
  landscape: 'forest' | 'mountains' | 'ocean' | 'city' | 'castle' | 'plains' | 'ruins' | 'space';
  atmosphere: 'peaceful' | 'tense' | 'magical' | 'romantic' | 'ominous' | 'melancholic' | 'epic';
  specialEffects: string[]; // e.g., ["fireflies", "falling leaves", "lightning", "stars"]
  description: string; // Detailed scene description for rendering
}

export interface Interpretation {
  bookTitle: string;
  author: string;
  genre: Genre;
  themes: string[];
  emotions: string[];
  atmosphere: string;
  narrative: string;
  vibeColor: string;
  accentColor: string;
  textColor: string;
  iconName: string;
  environmentScene: EnvironmentScene;
}

export interface World {
  id: string;
  userId: string;
  bookTitle: string;
  author: string;
  bookCover?: string;
  interpretation: Interpretation;
  createdAt: string;
}

export interface GoogleBooksResult {
  title: string;
  author: string;
  description: string;
  imageLinks?: { thumbnail: string };
}
