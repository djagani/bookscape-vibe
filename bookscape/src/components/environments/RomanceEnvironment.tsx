'use client';

import { useEffect, useRef } from 'react';
import type { World } from '@/lib/types';

interface EnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function RomanceEnvironment({ world, isMuted }: EnvironmentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (!isMuted) {
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  return (
    <div className="romance-environment w-full h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 animate-gradient"></div>

      {/* Floating hearts/petals */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-30 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        >
          {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🌹' : '💖'}
        </div>
      ))}

      {/* Soft glow overlay */}
      <div className="absolute inset-0 bg-white opacity-10 animate-pulse-slow"></div>

      {/* Audio element - users should replace with their own audio */}
      <audio ref={audioRef} loop>
        <source src="/audio/romance.mp3" type="audio/mpeg" />
      </audio>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        .animate-gradient {
          animation: gradient 6s ease-in-out infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
