'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import type { World, Genre } from '@/lib/types';
import EnvironmentViewer from '@/components/EnvironmentViewer';
import BookIcon from '@/components/BookIcon';
import { fixRomanceColors } from '@/lib/utils';

export default function EnvironmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Opening the portal...');
  const [fadeOut, setFadeOut] = useState(false);

  // Rotating loading text
  useEffect(() => {
    const messages = [
      'Opening the portal...',
      'Mapping the world...',
      'Feeling the vibe...',
      'Preparing your journey...',
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchWorld() {
      try {
        // Check if this is an unsaved world from sessionStorage
        if (id === 'new') {
          const stored = sessionStorage.getItem('currentWorld');
          if (stored) {
            const data = JSON.parse(stored);
            const tempWorld: World = {
              id: 'new',
              userId: '',
              bookTitle: data.interpretation.bookTitle,
              author: data.interpretation.author,
              bookCover: data.bookCover || null,
              interpretation: fixRomanceColors(data.interpretation),
              createdAt: new Date().toISOString(),
            };
            setWorld(tempWorld);
            // Show loading animation, then fade out smoothly
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(() => setLoading(false), 600);
            }, 2000);
            return;
          }
        }

        // Fetch saved world from API
        const { data: { session } } = await supabase.auth.getSession();

        const res = await fetch(`/api/worlds/${id}`, {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        });

        const data = await res.json();
        // Fix Romance colors
        const fixedWorld = {
          ...data.world,
          interpretation: fixRomanceColors(data.world.interpretation),
        };
        setWorld(fixedWorld);
        // Show loading animation, then fade out smoothly
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => setLoading(false), 600);
        }, 2000);
      } catch (error) {
        console.error('[Client] Fetch error:', error);
        setLoading(false);
      }
    }

    fetchWorld();
  }, [id]);

  if (loading || !world) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 transition-opacity"
        style={{
          backgroundColor: '#0f0a07',
          opacity: fadeOut ? 0 : 1,
          transitionDuration: '600ms',
        }}
      >
        {/* Icon with pulsing glow */}
        <div className="relative animate-fadeInUp">
          {/* Pulsing glow effect */}
          <div
            className="absolute inset-0 rounded-2xl blur-3xl animate-pulse-glow"
            style={{
              background: world
                ? `linear-gradient(135deg, ${world.interpretation.vibeColor} 0%, ${world.interpretation.accentColor} 100%)`
                : 'linear-gradient(135deg, #e9c46a 0%, #2a9d8f 100%)',
            }}
          />

          {/* Icon container */}
          <div
            className="relative w-48 h-64 rounded-2xl flex items-center justify-center transition-all duration-500"
            style={{
              background: world
                ? `linear-gradient(135deg, ${world.interpretation.vibeColor} 0%, ${world.interpretation.accentColor} 100%)`
                : 'linear-gradient(135deg, #e9c46a 0%, #2a9d8f 100%)',
              boxShadow: world
                ? `0 0 60px ${world.interpretation.accentColor}40`
                : '0 0 60px rgba(233, 196, 106, 0.4)',
            }}
          >
            {world && (
              <div className="animate-fadeInUp animate-delay-200">
                <BookIcon
                  iconName={world.interpretation.iconName || (world.interpretation as any).emoji}
                  size="large"
                />
              </div>
            )}
          </div>
        </div>

        {/* Book title */}
        {world && (
          <h2
            className="display-text text-2xl font-normal text-center px-8 animate-fadeInUp animate-delay-400"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
          >
            {world.bookTitle}
          </h2>
        )}

        {/* Rotating loading text */}
        <p
          className="display-text italic text-lg transition-opacity duration-500 animate-fadeInUp animate-delay-400"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          {loadingText}
        </p>
      </div>
    );
  }

  return <EnvironmentViewer world={world} />;
}
