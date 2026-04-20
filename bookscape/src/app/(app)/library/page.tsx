'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { World } from '@/lib/types';
import BookIcon from '@/components/BookIcon';
import { fixRomanceColors } from '@/lib/utils';

export default function Library() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loadingWorlds, setLoadingWorlds] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/signin');
    }
  }, [session, loading, router]);

  useEffect(() => {
    async function fetchWorlds() {
      if (!session) return;

      const { data: { session: currentSession } } = await supabase.auth.getSession();

      const res = await fetch('/api/worlds', {
        headers: {
          'Authorization': `Bearer ${currentSession?.access_token}`
        }
      });
      const data = await res.json();
      // Fix Romance colors to baby pink
      const fixedWorlds = (data.worlds || []).map((world: World) => ({
        ...world,
        interpretation: fixRomanceColors(world.interpretation),
      }));
      setWorlds(fixedWorlds);
      setLoadingWorlds(false);
    }

    if (session) {
      fetchWorlds();
    }
  }, [session]);

  const handleDelete = async (e: React.MouseEvent, worldId: string) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to remove this world from your library?')) {
      return;
    }

    setDeletingId(worldId);

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      const res = await fetch(`/api/worlds/${worldId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentSession?.access_token}`
        }
      });

      if (res.ok) {
        setWorlds(worlds.filter(w => w.id !== worldId));
      } else {
        alert('Failed to delete world');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete world');
    }

    setDeletingId(null);
  };

  if (loading || loadingWorlds) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="glass-panel px-8 py-4">
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 min-h-screen" style={{ backgroundColor: '#0f0a07' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <h1
              className="display-text font-normal tracking-wide"
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                letterSpacing: '0.02em',
              }}
            >
              Your Library
            </h1>
            <span
              className="px-3 py-1 rounded-full text-xs ui-text"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {worlds.length} {worlds.length === 1 ? 'World' : 'Worlds'}
            </span>
          </div>
          <p
            className="display-text italic"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1rem',
            }}
          >
            Step back into the worlds you've discovered
          </p>
        </div>

        {worlds.length === 0 ? (
          <div
            className="p-12 text-center rounded-2xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p
              className="display-text italic text-lg"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              No worlds saved yet. Create one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {worlds.map((world) => (
              <div
                key={world.id}
                className="relative overflow-hidden transition-all duration-200 group cursor-pointer rounded-2xl"
                onClick={() => router.push(`/world/${world.id}`)}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  height: '420px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, world.id)}
                  disabled={deletingId === world.id}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 z-20 ui-text text-xs"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                  title="Remove from library"
                >
                  {deletingId === world.id ? '...' : '✕'}
                </button>

                {/* Genre badge - top right */}
                {world.interpretation.genre && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="text-xs px-2.5 py-1 rounded-md backdrop-blur-md ui-text font-medium"
                      style={{
                        backgroundColor: `${world.interpretation.accentColor}20`,
                        border: `1px solid ${world.interpretation.accentColor}35`,
                        color: world.interpretation.accentColor,
                        fontSize: '0.7rem',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {world.interpretation.genre}
                    </span>
                  </div>
                )}

                {/* Icon display with gradient - fills the card */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Background that zooms on hover */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${world.interpretation.vibeColor} 0%, ${world.interpretation.accentColor} 100%)`,
                      transform: 'translateY(-15%)',
                    }}
                  >
                    <BookIcon iconName={world.interpretation.iconName || (world.interpretation as any).emoji} size="large" />
                  </div>

                  {/* Top-left dark brown gradient for genre badge visibility */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at top left, rgba(20,12,8,0.75) 0%, rgba(20,12,8,0.4) 35%, rgba(20,12,8,0.15) 55%, transparent 75%)',
                    }}
                  />

                  {/* Strong bottom dark brown gradient fade - covers text area */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(15,10,7,1) 0%, rgba(15,10,7,1) 25%, rgba(16,11,8,0.96) 32%, rgba(17,12,9,0.88) 40%, rgba(18,13,10,0.75) 48%, rgba(19,14,11,0.58) 56%, rgba(20,15,12,0.38) 64%, rgba(21,16,13,0.20) 72%, rgba(22,17,14,0.08) 80%, transparent 90%)',
                    }}
                  />
                </div>

                {/* Content - positioned over the bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2
                    className="display-text font-normal line-clamp-2"
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontSize: '1.85rem',
                      lineHeight: '1.2',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {world.bookTitle}
                  </h2>

                  <p
                    className="display-text italic line-clamp-1"
                    style={{
                      color: 'rgba(255, 255, 255, 0.55)',
                      fontSize: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {world.author}
                  </p>

                  {/* Enter World button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/world/${world.id}/environment`);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ui-text flex items-center justify-between group/btn"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.8rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(255, 200, 50, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 200, 50, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span>Enter World</span>
                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
