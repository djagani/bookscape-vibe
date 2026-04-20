'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { World } from '@/lib/types';
import Button from './Button';
import BookIcon from './BookIcon';
import { fixRomanceColors } from '@/lib/utils';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { buildSpotifySearchQuery } from '@/lib/spotify';
import SpotifyPlayer from './SpotifyPlayer';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export default function WorldDisplay({ world }: { world: World }) {
  // Fix Romance colors
  const fixedWorld = {
    ...world,
    interpretation: fixRomanceColors(world.interpretation),
  };
  const { session } = useAuth();
  const [saved, setSaved] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Spotify integration
  const spotifyAuth = useSpotifyAuth();
  const [spotifyTrackUri, setSpotifyTrackUri] = useState<string | null>(null);
  const [searchingMusic, setSearchingMusic] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // Check if book is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!session || fixedWorld.id !== 'new') return;

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        const res = await fetch('/api/worlds', {
          headers: {
            'Authorization': `Bearer ${currentSession?.access_token}`
          }
        });

        if (res.ok) {
          const { worlds } = await res.json();
          const exists = worlds.some((w: World) =>
            w.bookTitle === fixedWorld.bookTitle && w.author === fixedWorld.author
          );
          setAlreadySaved(exists);
        }
      } catch (err) {
        console.error('Check saved error:', err);
      }
    };

    checkIfSaved();
  }, [session, fixedWorld.id, fixedWorld.bookTitle, fixedWorld.author]);

  // Search for matching music when Spotify is authenticated
  useEffect(() => {
    if (!spotifyAuth.isAuthenticated || spotifyAuth.loading) return;

    const searchMusic = async () => {
      setSearchingMusic(true);

      try {
        const query = buildSpotifySearchQuery(fixedWorld.interpretation);
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);

        if (response.ok) {
          const { playlists, tracks } = await response.json();

          // Prefer playlists over individual tracks
          if (playlists && playlists.length > 0) {
            setSpotifyTrackUri(playlists[0].uri);
          } else if (tracks && tracks.length > 0) {
            setSpotifyTrackUri(tracks[0].uri);
          }
        } else if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await spotifyAuth.refresh();
          if (refreshed) {
            // Retry search
            searchMusic();
          }
        }
      } catch (error) {
        console.error('Music search error:', error);
      } finally {
        setSearchingMusic(false);
      }
    };

    searchMusic();
  }, [spotifyAuth.isAuthenticated, spotifyAuth.loading]);

  const handleSave = async () => {
    if (!session) {
      router.push('/signin');
      return;
    }

    if (alreadySaved) {
      return;
    }

    setLoading(true);

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      const res = await fetch('/api/worlds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession?.access_token}`
        },
        body: JSON.stringify({
          bookTitle: fixedWorld.bookTitle,
          author: fixedWorld.author,
          bookCover: null, // Don't save cover - use icon instead
          interpretation: fixedWorld.interpretation,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => window.location.href = '/library', 1000);
      } else if (res.status === 409) {
        setAlreadySaved(true);
        alert('This book is already saved in your library.');
      } else {
        const error = await res.json();
        console.error('Save failed:', error);
        alert('Failed to save world. Please try again.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save world. Please try again.');
    }

    setLoading(false);
  };

  const interp = fixedWorld.interpretation;

  return (
    <div
      className="world-wrapper min-h-screen relative overflow-hidden flex items-center justify-center p-6"
      style={{
        '--vibe-color': interp.vibeColor,
        '--accent-color': interp.accentColor,
        '--text-color': interp.textColor,
      } as React.CSSProperties}
    >
      {/* Full-bleed background image - same as landing page */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/landingpg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(12px)',
        }}
      />

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Centered content card */}
      <div
        className="relative max-w-2xl w-full flex flex-col gap-6 p-8 rounded-2xl overflow-y-auto scrollbar-hide z-10"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(30px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          maxHeight: '90vh',
        }}
      >
        {/* Header with icon and title */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <BookIcon iconName={interp.iconName || (interp as any).emoji} size="large" />
          </div>
          {interp.genre && (
            <div className="mb-3">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ui-text"
                style={{
                  backgroundColor: `${interp.accentColor}20`,
                  border: `1px solid ${interp.accentColor}40`,
                  color: interp.accentColor,
                }}
              >
                {interp.genre}
              </span>
            </div>
          )}
          <h1 className="display-text text-4xl font-semibold mb-2" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            {fixedWorld.bookTitle}
          </h1>
          <p className="display-text text-xl italic mb-6" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
            {fixedWorld.author}
          </p>
        </div>

        {/* Themes */}
        <div>
          <h2
            className="text-[10px] uppercase tracking-[0.12em] mb-3 ui-text"
            style={{ color: 'rgba(255, 255, 255, 0.40)' }}
          >
            Themes
          </h2>
          <div className="flex flex-wrap gap-2">
            {interp.themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1 rounded-full text-xs ui-text"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  color: 'rgba(255, 255, 255, 0.75)',
                }}
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Emotions */}
        <div>
          <h2
            className="text-[10px] uppercase tracking-[0.12em] mb-3 ui-text"
            style={{ color: 'rgba(255, 255, 255, 0.40)' }}
          >
            Emotions
          </h2>
          <div className="flex flex-wrap gap-2">
            {interp.emotions.map((emotion) => (
              <span
                key={emotion}
                className="px-3 py-1 rounded-full text-xs ui-text"
                style={{
                  backgroundColor: `${interp.accentColor}15`,
                  border: `1px solid ${interp.accentColor}30`,
                  color: 'rgba(255, 255, 255, 0.75)',
                }}
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>

        {/* Atmosphere */}
        <div>
          <h2
            className="text-[10px] uppercase tracking-[0.12em] mb-3 ui-text"
            style={{ color: 'rgba(255, 255, 255, 0.40)' }}
          >
            Atmosphere
          </h2>
          <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.80)', lineHeight: '1.8' }}>
            {interp.atmosphere}
          </p>
        </div>

        {/* The World */}
        <div>
          <h2
            className="text-[10px] uppercase tracking-[0.12em] mb-3 ui-text"
            style={{ color: 'rgba(255, 255, 255, 0.40)' }}
          >
            The World
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.8' }}>
            {interp.narrative}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          {/* Spotify Connect/Play Button */}
          {!spotifyAuth.isAuthenticated ? (
            <button
              onClick={() => spotifyAuth.login(window.location.pathname)}
              className="w-full px-6 py-3 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 ui-text flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#1DB954',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1ed760';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1DB954';
              }}
            >
              <MusicNoteIcon fontSize="small" />
              Connect Spotify for Music
            </button>
          ) : searchingMusic ? (
            <button
              disabled
              className="w-full px-6 py-3 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 ui-text opacity-60"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Searching for music...
            </button>
          ) : spotifyTrackUri && !showPlayer ? (
            <button
              onClick={() => setShowPlayer(true)}
              className="w-full px-6 py-3 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 ui-text flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#1DB954',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1ed760';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1DB954';
              }}
            >
              <MusicNoteIcon fontSize="small" />
              Play Atmospheric Music
            </button>
          ) : null}

          <button
            onClick={handleSave}
            disabled={loading || saved || alreadySaved}
            className="w-full px-6 py-3 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 disabled:opacity-50 ui-text"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
            onMouseEnter={(e) => {
              if (!loading && !saved && !alreadySaved) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            {alreadySaved ? '✓ Already Saved' : saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save This World'}
          </button>
          {fixedWorld.id && (
            <button
              onClick={() => router.push(`/world/${fixedWorld.id}/environment`)}
              className="w-full px-6 py-3 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 ui-text"
              style={{
                backgroundColor: `${interp.accentColor}20`,
                border: `1px solid ${interp.accentColor}40`,
                color: interp.accentColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${interp.accentColor}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${interp.accentColor}20`;
              }}
            >
              Enter World
            </button>
          )}
        </div>
      </div>

      {/* Spotify Player (fixed position, outside content card) */}
      {showPlayer && spotifyTrackUri && (
        <SpotifyPlayer
          trackUri={spotifyTrackUri}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}
