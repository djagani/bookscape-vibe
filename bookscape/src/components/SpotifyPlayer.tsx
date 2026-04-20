'use client';

import { useState, useEffect, useRef } from 'react';
import { getSpotifyAccessToken, refreshSpotifyTokenIfNeeded } from '@/lib/spotifyAuth';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface SpotifyPlayerProps {
  trackUri: string;
  onClose?: () => void;
}

// Extend Window interface for Spotify SDK
declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export default function SpotifyPlayer({ trackUri, onClose }: SpotifyPlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const playerRef = useRef<any>(null);

  // Load Spotify SDK
  useEffect(() => {
    if (window.Spotify) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.net/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setSdkLoaded(true);
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize player when SDK is loaded
  useEffect(() => {
    if (!sdkLoaded || playerRef.current) return;

    const token = getSpotifyAccessToken();
    if (!token) {
      setError('Not authenticated with Spotify');
      return;
    }

    const spotifyPlayer = new window.Spotify.Player({
      name: 'BookScape Player',
      getOAuthToken: (cb: (token: string) => void) => {
        const currentToken = getSpotifyAccessToken();
        if (currentToken) {
          cb(currentToken);
        }
      },
      volume: volume / 100,
    });

    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }: any) => {
      console.error('Spotify initialization error:', message);
      setError('Failed to initialize player');
    });

    spotifyPlayer.addListener('authentication_error', async ({ message }: any) => {
      console.error('Spotify authentication error:', message);
      const refreshed = await refreshSpotifyTokenIfNeeded();
      if (!refreshed) {
        setError('Authentication failed. Please reconnect Spotify.');
      }
    });

    spotifyPlayer.addListener('account_error', ({ message }: any) => {
      console.error('Spotify account error:', message);
      setError('Spotify Premium required for playback');
    });

    spotifyPlayer.addListener('playback_error', ({ message }: any) => {
      console.error('Spotify playback error:', message);
      setError('Playback failed');
    });

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }: any) => {
      console.log('Spotify player ready with Device ID', device_id);
      setDeviceId(device_id);
      setError(null);
    });

    // Not Ready
    spotifyPlayer.addListener('not_ready', ({ device_id }: any) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Player state changed
    spotifyPlayer.addListener('player_state_changed', (state: any) => {
      if (!state) return;

      setCurrentTrack(state.track_window.current_track);
      setIsPaused(state.paused);

      spotifyPlayer.getCurrentState().then((state: any) => {
        setIsPlaying(!state ? false : !state.paused);
      });
    });

    // Connect to player
    spotifyPlayer.connect().then((success: boolean) => {
      if (success) {
        console.log('Spotify player connected successfully');
      }
    });

    playerRef.current = spotifyPlayer;
    setPlayer(spotifyPlayer);

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [sdkLoaded]);

  // Play track when device is ready
  useEffect(() => {
    if (!deviceId || !trackUri) return;

    const token = getSpotifyAccessToken();
    if (!token) return;

    // Start playback
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setIsPlaying(true);
        setIsPaused(false);
      })
      .catch((error) => {
        console.error('Failed to start playback:', error);
        setError('Failed to start playback');
      });
  }, [deviceId, trackUri]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!player) return;

    player.togglePlay().then(() => {
      setIsPlaying(!isPlaying);
    });
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    if (!player) return;

    setVolume(newVolume);
    player.setVolume(newVolume / 100);
  };

  // Handle close
  const handleClose = () => {
    if (player) {
      player.disconnect();
    }
    onClose?.();
  };

  if (error) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl max-w-xs"
        style={{
          background: 'rgba(255, 50, 50, 0.15)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 50, 50, 0.3)',
        }}
      >
        <p className="text-sm" style={{ color: 'rgba(255, 200, 200, 0.9)' }}>
          {error}
        </p>
      </div>
    );
  }

  if (!isExpanded) {
    // Minimized state - floating music icon button
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{
          background: 'rgba(10, 10, 15, 0.65)',
          backdropFilter: 'blur(18px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <MusicNoteIcon style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '24px' }} />
      </button>
    );
  }

  // Expanded state - full player
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl p-4 transition-all duration-300"
      style={{
        background: 'rgba(10, 10, 15, 0.75)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.6)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
        }}
      >
        <CloseIcon fontSize="small" />
      </button>

      {/* Minimize button */}
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-2 right-12 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '20px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
        }}
      >
        −
      </button>

      {/* Track info */}
      <div className="mb-4 pr-20">
        {currentTrack ? (
          <>
            {currentTrack.album.images[0] && (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.name}
                className="w-full h-auto rounded-lg mb-3"
              />
            )}
            <h3
              className="text-sm font-semibold mb-1 line-clamp-1"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              {currentTrack.name}
            </h3>
            <p
              className="text-xs line-clamp-1"
              style={{ color: 'rgba(255, 255, 255, 0.60)' }}
            >
              {currentTrack.artists.map((artist: any) => artist.name).join(', ')}
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <MusicNoteIcon style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '48px' }} />
            <p className="text-sm mt-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Loading player...
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          disabled={!player}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
          }}
          onMouseEnter={(e) => {
            if (player) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
          }}
        >
          {isPaused || !isPlaying ? (
            <PlayArrowIcon style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
          ) : (
            <PauseIcon style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
          )}
        </button>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-3">
        {volume > 0 ? (
          <VolumeUpIcon style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '20px' }} />
        ) : (
          <VolumeOffIcon style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '20px' }} />
        )}
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <span
          className="text-xs w-8 text-right"
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        >
          {volume}%
        </span>
      </div>
    </div>
  );
}
