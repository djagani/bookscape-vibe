# Unsplash API Setup for High-Quality Environment Images

The immersive book environments use high-quality, realistic scenic photography from Unsplash.

## Get Your Free Unsplash API Key (2 minutes):

1. **Go to** https://unsplash.com/developers

2. **Sign up** or log in (free account)

3. **Create a new app**:
   - Click "New Application"
   - Accept the API terms
   - Name your app (e.g., "BookScape")
   - Description: "Book vibe visualization app"

4. **Copy your Access Key**:
   - You'll see "Access Key" on your app page
   - Copy this key

5. **Add to your .env.local**:
   ```
   UNSPLASH_ACCESS_KEY=your-actual-access-key-here
   ```

6. **Restart your dev server**

## Free Tier Limits:
- 50 requests per hour
- Perfect for development and small projects
- More than enough for this app

## What It Does:
For each book, the app searches Unsplash for realistic photos matching:
- The book's setting (castle, forest, city, etc.)
- Time of day (dawn, day, dusk, night)
- Weather (clear, rainy, foggy, etc.)
- Atmosphere (magical, tense, romantic, etc.)

Then adds subtle motion effects (ken-burns zoom/pan) and atmospheric overlays!

## Example:
- **Harry Potter** → Searches: "magical castle dusk clear mystical cinematic"
- **Hunger Games** → Searches: "forest day clear tense cinematic"
- **1984** → Searches: "dystopian city cloudy night ominous cinematic"

## Without API Key:
The app will still work with fallback gradients, but you'll miss the stunning realistic imagery!
