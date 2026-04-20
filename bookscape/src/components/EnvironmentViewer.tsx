'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import type { World } from '@/lib/types';
import DynamicEnvironment from './DynamicEnvironment';
import BookIcon from './BookIcon';
import { fixRomanceColors } from '@/lib/utils';

interface EnvironmentViewerProps {
  world: World;
  useCSSFallback?: boolean;
}

export default function EnvironmentViewer({ world, useCSSFallback = false }: EnvironmentViewerProps) {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Fix Romance colors
  const fixedWorld = {
    ...world,
    interpretation: fixRomanceColors(world.interpretation),
  };
  const interp = fixedWorld.interpretation;

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <DynamicEnvironment world={fixedWorld} isMuted={isMuted} />

      {/* Controls overlay */}
      <div
        className="absolute top-4 left-4 right-4 flex justify-between items-start z-50 transition-opacity duration-700"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-xl backdrop-blur-xl transition-all duration-200 ui-text text-sm"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
          }}
        >
          ← Back
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-xl backdrop-blur-xl transition-all duration-200"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
          }}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </button>
      </div>

      {/* Right side gradient fade overlay */}
      <div
        className="absolute top-0 bottom-0 right-0 w-full lg:w-1/2 pointer-events-none z-30 transition-opacity duration-700"
        style={{
          background: 'linear-gradient(to left, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.45) 40%, transparent 100%)',
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Right side content - no box, just text with backdrop */}
      <div
        className="absolute inset-0 flex items-center justify-end p-6 lg:pr-16 pt-24 pb-10 z-40 pointer-events-none transition-opacity duration-700"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className="w-full lg:w-[420px] flex flex-col gap-6 overflow-y-auto scrollbar-hide pointer-events-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          {/* Icon */}
          <div
            className="flex justify-center lg:justify-start transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '200ms',
            }}
          >
            <BookIcon iconName={interp.iconName || (interp as any).emoji} size="large" />
          </div>

          {/* Genre badge */}
          {interp.genre && (
            <div
              className="flex justify-center lg:justify-start transition-all duration-500"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '300ms',
              }}
            >
              <span
                className="px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md ui-text"
                style={{
                  backgroundColor: `${interp.accentColor}25`,
                  border: `1px solid ${interp.accentColor}40`,
                  color: interp.accentColor,
                }}
              >
                {interp.genre}
              </span>
            </div>
          )}

          {/* Book title */}
          <h1
            className="display-text font-semibold leading-tight text-center lg:text-left transition-all duration-500"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '400ms',
            }}
          >
            {fixedWorld.bookTitle}
          </h1>

          {/* Author */}
          <p
            className="display-text italic text-lg text-center lg:text-left transition-all duration-500"
            style={{
              color: 'rgba(255, 255, 255, 0.70)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              marginTop: '-1rem',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '500ms',
            }}
          >
            {fixedWorld.author}
          </p>

          {/* The World */}
          <div
            className="transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '600ms',
            }}
          >
            <h2
              className="text-[10px] uppercase tracking-[0.14em] mb-3 ui-text text-center lg:text-left"
              style={{ color: 'rgba(255, 255, 255, 0.50)', textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}
            >
              The World
            </h2>
            <p
              className="text-sm leading-relaxed text-center lg:text-left"
              style={{
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: '1.7',
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.6)',
              }}
            >
              {interp.narrative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
