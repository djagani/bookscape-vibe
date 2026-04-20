'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { World } from '@/lib/types';
import DynamicEnvironment from './DynamicEnvironment';

interface EnvironmentViewerProps {
  world: World;
  useCSSFallback?: boolean; // Option to use pure CSS instead of photos
}

export default function EnvironmentViewer({ world, useCSSFallback = false }: EnvironmentViewerProps) {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const scene = world.interpretation.environmentScene;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DynamicEnvironment world={world} isMuted={isMuted} />

      {/* Controls overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-lg text-white transition backdrop-blur-sm"
        >
          ← Back
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="px-4 py-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-lg text-white transition backdrop-blur-sm"
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
      </div>

      {/* Book info overlay */}
      <div className="absolute bottom-8 left-8 right-8 text-center z-50">
        <div className="inline-block max-w-2xl px-6 py-4 bg-black bg-opacity-60 rounded-lg backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">{world.bookTitle}</h1>
          <p className="text-xl text-gray-200 mb-2">{world.author}</p>
          {scene?.description && (
            <p className="text-sm text-gray-300 italic mb-2">{scene.description}</p>
          )}
          {world.interpretation.genre && (
            <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-white">
              {world.interpretation.genre}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
