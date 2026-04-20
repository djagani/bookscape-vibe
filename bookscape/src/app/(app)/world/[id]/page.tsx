'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import type { World } from '@/lib/types';
import WorldDisplay from '@/components/WorldDisplay';

export default function WorldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorld() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[Client] Fetching world:', id);
        console.log('[Client] Has session:', !!session);

        const res = await fetch(`/api/worlds/${id}`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });

        console.log('[Client] Response status:', res.status);
        const data = await res.json();
        console.log('[Client] Response data:', data);

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
    return <div className="p-8 text-center">Loading world...</div>;
  }

  if (!world) {
    return <div className="p-8 text-center">World not found</div>;
  }

  return <WorldDisplay world={world} />;
}
