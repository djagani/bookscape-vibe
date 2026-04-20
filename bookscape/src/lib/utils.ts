import type { GoogleBooksResult, Interpretation } from './types';

/**
 * Fix Romance genre colors to use accessible baby pink
 * Overrides any dark/purple pinks with a soft baby pink
 */
export function fixRomanceColors(interpretation: Interpretation): Interpretation {
  if (interpretation.genre?.toLowerCase() === 'romance') {
    return {
      ...interpretation,
      accentColor: '#FFB6D9', // Soft baby pink with proper contrast
    };
  }
  return interpretation;
}

/**
 * Get the highest quality book cover image from Google Books imageLinks
 * Also upgrades thumbnail URLs by removing or changing zoom parameter
 */
export function getHighQualityBookCover(imageLinks?: GoogleBooksResult['imageLinks']): string | undefined {
  if (!imageLinks) return undefined;

  // Priority order: largest to smallest
  const priorityOrder = [
    'extraLarge',
    'large',
    'medium',
    'small',
    'thumbnail',
    'smallThumbnail',
  ] as const;

  for (const size of priorityOrder) {
    const url = imageLinks[size];
    if (url) {
      // Upgrade Google Books thumbnail URLs for better quality
      // Replace zoom=1 with zoom=0 or remove it for larger images
      return url
        .replace('&edge=curl', '') // Remove curl effect
        .replace('zoom=1', 'zoom=0') // Get larger version
        .replace('http://', 'https://'); // Use HTTPS
    }
  }

  return undefined;
}
