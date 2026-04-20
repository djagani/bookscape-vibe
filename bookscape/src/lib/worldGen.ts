import type { Genre } from './types';

interface BookWorld {
  genre: Genre;
  themes: string[];
  emotions: string[];
  atmosphere: string;
  vibeColor: string;
  accentColor: string;
}

// Genre-specific visual keywords from CLAUDE.md
const genreVisualKeywords: Record<Genre, string> = {
  'Romance': 'warm cherry blossom light rays rose garden cathedral golden soft sunlight pink petals stained glass light doves',
  'Fantasy': 'elven castle cliffside waterfalls golden towers teal lake lush ancient forests mystical',
  'Thriller/Mystery': 'gothic moonlit cathedral rain-slicked stone bats full moon dramatic storm clouds lantern darkness noir',
  'Dystopian': 'neon-soaked megacity acid rain toxic green fog overcrowded streets billboard propaganda cyberpunk urban decay',
  'Historical/Mythological': 'oil painting golden-hour London Thames horse carriages gaslit streets impressionist brushstroke amber ochre warmth',
  'Melancholic': 'lone figure rain crumbling cafe birds scattering foggy city single warm light cold darkness wet cobblestones',
};

const genreColorPalette: Record<Genre, string> = {
  'Romance': 'rose blush warm amber deep rose cream color palette',
  'Fantasy': 'teal gold silver-blue midnight color palette',
  'Thriller/Mystery': 'near-black dark navy blood red cold gray color palette',
  'Dystopian': 'toxic neon green warning orange concrete color palette',
  'Historical/Mythological': 'aged gold rich brown parchment sepia color palette',
  'Melancholic': 'dark slate fog gray muted blue faded amber color palette',
};

const genreArtStyle: Record<Genre, string> = {
  'Romance': 'soft dreamy painterly illustration romantic lighting',
  'Fantasy': 'epic cinematic atmospheric fantasy art dramatic lighting',
  'Thriller/Mystery': 'dark moody cinematic noir dramatic shadows',
  'Dystopian': 'gritty cinematic cyberpunk neon lighting urban photography',
  'Historical/Mythological': 'classical painterly impressionist historical art warm lighting',
  'Melancholic': 'moody atmospheric melancholic painting soft lighting',
};

/**
 * Builds a detailed, specific image prompt for world generation
 * Combines genre visual mood + themes + atmosphere + color palette
 * Optimized for Unsplash search and AI image generation
 */
export function buildImagePrompt(world: BookWorld): string {
  const genreKeywords = genreVisualKeywords[world.genre] || '';
  const colorPalette = genreColorPalette[world.genre] || '';
  const artStyle = genreArtStyle[world.genre] || 'cinematic atmospheric';

  // Get top 2-3 theme words
  const themeWords = world.themes
    .slice(0, 2)
    .join(' ')
    .toLowerCase();

  // Get atmosphere keywords (first 3 words)
  const atmosphereWords = world.atmosphere
    .split(' ')
    .slice(0, 3)
    .join(' ');

  // Build comprehensive prompt
  const prompt = `${genreKeywords} ${themeWords} ${atmosphereWords} ${artStyle} ${colorPalette} HD dramatic cinematic`;

  // Clean up: remove extra spaces, limit length for Unsplash
  const cleanPrompt = prompt
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120); // Unsplash has query length limits

  console.log('[WorldGen] Built image prompt:', cleanPrompt);
  return cleanPrompt;
}

/**
 * Builds a detailed prompt for AI image generation (Pollinations.ai)
 * More detailed version for AI generation (no length limit)
 */
export function buildDetailedImagePrompt(world: BookWorld): string {
  const genreKeywords = genreVisualKeywords[world.genre] || '';
  const colorPalette = genreColorPalette[world.genre] || '';
  const artStyle = genreArtStyle[world.genre] || 'cinematic atmospheric';

  const themeWords = world.themes.slice(0, 3).join(', ');
  const emotionWords = world.emotions.slice(0, 2).join(' ');
  const atmosphereWords = world.atmosphere;

  // More detailed prompt for AI generation
  const prompt = `${genreKeywords}, ${atmosphereWords}, ${themeWords}, ${emotionWords}, ${artStyle}, ${colorPalette}, ultra detailed, 8k, photorealistic, dramatic composition`;

  return prompt.replace(/\s+/g, ' ').trim();
}
