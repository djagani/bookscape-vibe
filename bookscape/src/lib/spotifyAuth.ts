// Client-side Spotify authentication utilities

// Get Spotify access token from cookies
export function getSpotifyAccessToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('spotify_access_token='));

  if (!tokenCookie) return null;

  return tokenCookie.split('=')[1];
}

// Get Spotify refresh token from cookies
export function getSpotifyRefreshToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('spotify_refresh_token='));

  if (!tokenCookie) return null;

  return tokenCookie.split('=')[1];
}

// Check if user is authenticated with Spotify
export function isSpotifyAuthenticated(): boolean {
  return !!getSpotifyAccessToken();
}

// Refresh Spotify token if needed
export async function refreshSpotifyTokenIfNeeded(): Promise<boolean> {
  const refreshToken = getSpotifyRefreshToken();

  if (!refreshToken) return false;

  try {
    const response = await fetch('/api/spotify/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to refresh Spotify token:', error);
    return false;
  }
}

// Clear Spotify authentication
export function clearSpotifyAuth(): void {
  if (typeof document === 'undefined') return;

  document.cookie = 'spotify_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'spotify_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// Redirect to Spotify login
export function loginWithSpotify(redirectPath?: string): void {
  const currentPath = redirectPath || window.location.pathname;
  window.location.href = `/api/spotify/login?redirect=${encodeURIComponent(currentPath)}`;
}
