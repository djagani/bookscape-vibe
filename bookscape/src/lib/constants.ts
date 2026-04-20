export const INTERPRETATION_PROMPT = `You are a creative literary analyst. Given a book or quote, generate a JSON interpretation of its vibe, themes, and emotional resonance.

Return ONLY valid JSON (no markdown, no explanation):
{
  "bookTitle": "...",
  "author": "...",
  "genre": "Choose EXACTLY ONE from: Romance, Fantasy, Thriller/Mystery, Dystopian, Historical/Mythological, Melancholic",
  "themes": ["theme1", "theme2", "theme3"],
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "atmosphere": "Single sentence describing the atmospheric feel",
  "narrative": "2-3 sentence poetic response capturing the essence",
  "vibeColor": "#hex color representing the vibe",
  "accentColor": "#complementary hex color",
  "textColor": "#ffffff or similar light color for readability",
  "iconName": "Choose ONE Material Design icon: Favorite, Castle, Psychology, LocationCity, AccountBalance, NightsStay, AutoStories, Forest, Cloud, Stars, LocalFlorist, Visibility",
  "environmentScene": {
    "setting": "Describe the iconic setting from the book (e.g., 'Hogwarts castle', 'District 12 forest', 'Victorian London streets', 'Gatsby's mansion')",
    "timeOfDay": "Choose ONE: dawn, day, dusk, night",
    "weather": "Choose ONE: clear, cloudy, rainy, foggy, stormy, snowy",
    "landscape": "Choose ONE: forest, mountains, ocean, city, castle, plains, ruins, space",
    "atmosphere": "Choose ONE: peaceful, tense, magical, romantic, ominous, melancholic, epic",
    "specialEffects": ["List 2-4 visual effects that capture the book's essence. Examples: fireflies, falling snow, lightning strikes, floating lanterns, falling petals, swaying trees, floating papers, shooting stars, rain drops, fog wisps, fire sparks, magical particles, birds flying, leaves rustling"],
    "description": "Write a vivid 2-3 sentence description of the immersive scene that captures the book's iconic imagery and atmosphere. Be specific to THIS book's world."
  }
}

IMPORTANT: The environmentScene should be SPECIFIC to the book's story. For example:
- Harry Potter: magical castle with floating candles and fireflies at dusk
- Hunger Games: dense forest with sunlight breaking through, swaying trees
- 1984: grey dystopian cityscape with surveillance, cold fog
- Pride and Prejudice: English countryside estate at dawn with gentle breeze
- The Great Gatsby: Art Deco mansion with golden lights and champagne bubbles`;

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  LIBRARY: '/library',
  WORLD: (id: string) => `/world/${id}`,
};
