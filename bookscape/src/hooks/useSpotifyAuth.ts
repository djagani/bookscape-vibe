'use client';

import { useState, useEffect } from 'react';
import {
  isSpotifyAuthenticated,
  getSpotifyAccessToken,
  refreshSpotifyTokenIfNeeded,
  loginWithSpotify,
  clearSpotifyAuth,
} from '@/lib/spotifyAuth';

export function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);

    const authenticated = isSpotifyAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      const accessToken = getSpotifyAccessToken();
      setToken(accessToken);
    }

    setLoading(false);
  };

  const login = (redirectPath?: string) => {
    loginWithSpotify(redirectPath);
  };

  const logout = () => {
    clearSpotifyAuth();
    setIsAuthenticated(false);
    setToken(null);
  };

  const refresh = async () => {
    const success = await refreshSpotifyTokenIfNeeded();
    if (success) {
      await checkAuth();
    }
    return success;
  };

  return {
    isAuthenticated,
    token,
    loading,
    login,
    logout,
    refresh,
  };
}
