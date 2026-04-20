'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { World } from '@/lib/types';
import BookIcon from '@/components/BookIcon';

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
      setWorlds(data.worlds || []);
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
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Your Library</h1>
      {worlds.length === 0 ? (
        <p className="text-gray-400">No worlds saved yet. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worlds.map((world) => (
            <div
              key={world.id}
              className="relative p-6 rounded-lg transition group"
              style={{ backgroundColor: world.interpretation.vibeColor }}
            >
              <button
                onClick={(e) => handleDelete(e, world.id)}
                disabled={deletingId === world.id}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
                title="Remove from library"
              >
                {deletingId === world.id ? '...' : '✕'}
              </button>
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/world/${world.id}`)}
              >
                <div className="mb-3 flex justify-center">
                  <BookIcon iconName={world.interpretation.iconName || (world.interpretation as any).emoji} size="small" />
                </div>
                {world.interpretation.genre && (
                  <div className="mb-2">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                      {world.interpretation.genre}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-bold">{world.bookTitle}</h2>
                <p className="text-sm opacity-80 mb-4">{world.author}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/world/${world.id}/environment`);
                }}
                className="w-full mt-2 px-4 py-2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-lg text-sm font-medium transition"
              >
                Enter World
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
