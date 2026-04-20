import type { Interpretation } from './types';

// Spotify API types
export interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  images: { url: string }[];
  tracks: { total: number };
  owner: { display_name: string };
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  external_urls: { spotify: string };
}

export interface SpotifySearchResult {
  playlists?: {
    items: SpotifyPlaylist[];
  };
  tracks?: {
    items: SpotifyTrack[];
  };
}

// Build search query from book interpretation
export function buildSpotifySearchQuery(interpretation: Interpretation): string {
  const { genre, themes, emotions } = interpretation;

  // Map BookScape genres to Spotify search terms
  const genreMap: Record<string, string> = {
    'Romance': 'romantic classical piano love',
    'Fantasy': 'epic fantasy orchestral cinematic',
    'Thriller/Mystery': 'dark ambient thriller suspense',
    'Dystopian': 'cyberpunk electronic industrial dystopian',
    'Historical/Mythological': 'classical period orchestral historical',
    'Melancholic': 'melancholic piano sad emotional'
  };

  const baseGenre = genreMap[genre] || 'ambient instrumental';
  const themeWords = themes.slice(0, 2).join(' ');
  const emotion = emotions[0] || '';

  // Build query: genre keywords + emotion + themes
  return `${baseGenre} ${emotion} ${themeWords}`.trim();
}

// Get Spotify authorization URL
export function getSpotifyAuthUrl(redirectPath: string = '/'): string {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('Spotify credentials not configured');
  }

  const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state'
  ];

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state: redirectPath, // Store where to redirect after auth
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForToken(code: string): Promise<SpotifyToken> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Spotify credentials not configured');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify token exchange failed: ${error}`);
  }

  return response.json();
}

// Refresh access token using refresh token
export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyToken> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify token refresh failed: ${error}`);
  }

  return response.json();
}

// Search Spotify for playlists and tracks
export async function searchSpotify(
  query: string,
  accessToken: string
): Promise<SpotifySearchResult> {
  const params = new URLSearchParams({
    q: query,
    type: 'playlist,track',
    limit: '5',
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify search failed: ${error}`);
  }

  return response.json();
}
