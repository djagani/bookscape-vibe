'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import type { World, Genre } from '@/lib/types';
import EnvironmentViewer from '@/components/EnvironmentViewer';

export default function EnvironmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorld() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        const res = await fetch(`/api/worlds/${id}`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });

        const data = await res.json();
        setWorld(data.world);
        setLoading(false);
      } catch (error) {
        console.error('[Client] Fetch error:', error);
        setLoading(false);
      }
    }

    fetchWorld();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading environment...</div>;
  }

  if (!world) {
    return <div className="min-h-screen flex items-center justify-center">World not found</div>;
  }

  return <EnvironmentViewer world={world} />;
}
