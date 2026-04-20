'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { World } from '@/lib/types';
import Button from './Button';
import BookIcon from './BookIcon';

export default function WorldDisplay({ world }: { world: World }) {
  const { session } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!session) {
      router.push('/signin');
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
          bookTitle: world.bookTitle,
          author: world.author,
          bookCover: world.bookCover,
          interpretation: world.interpretation,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => window.location.href = '/library', 1000);
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

  const interp = world.interpretation;

  return (
    <div
      className="world-wrapper min-h-screen p-8"
      style={{
        '--vibe-color': interp.vibeColor,
        '--accent-color': interp.accentColor,
        '--text-color': interp.textColor,
      } as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <BookIcon iconName={interp.iconName || (interp as any).emoji} size="large" />
          </div>
          {interp.genre && (
            <div className="mb-4">
              <span className="px-4 py-2 rounded-full text-sm font-semibold accent" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                {interp.genre}
              </span>
            </div>
          )}
          <h1 className="text-5xl font-bold mb-2">{world.bookTitle}</h1>
          <p className="text-2xl opacity-80">{world.author}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-semibold mb-4 accent">Themes</h2>
            <div className="space-y-2">
              {interp.themes.map((theme) => (
                <div key={theme} className="text-lg opacity-90">
                  ✨ {theme}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 accent">Emotions</h2>
            <div className="space-y-2">
              {interp.emotions.map((emotion) => (
                <div key={emotion} className="text-lg opacity-90">
                  💫 {emotion}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 accent">Atmosphere</h2>
          <p className="text-lg opacity-90 italic">{interp.atmosphere}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 accent">Interpretation</h2>
          <p className="text-lg opacity-90 leading-relaxed">{interp.narrative}</p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={handleSave}
            disabled={loading || saved}
            className="text-lg px-8 py-3"
          >
            {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save This World'}
          </Button>
          {world.id && (
            <Button
              onClick={() => router.push(`/world/${world.id}/environment`)}
              className="text-lg px-8 py-3"
            >
              Enter World
            </Button>
          )}
          <Button variant="secondary" onClick={() => router.push('/')} className="text-lg px-8 py-3">
            Create Another
          </Button>
        </div>
      </div>
    </div>
  );
}
