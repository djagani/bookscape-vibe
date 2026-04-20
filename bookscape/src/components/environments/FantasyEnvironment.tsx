'use client';

import { useEffect, useRef } from 'react';
import type { World } from '@/lib/types';

interface EnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function FantasyEnvironment({ world, isMuted }: EnvironmentProps) {
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
    <div className="fantasy-environment w-full h-screen relative overflow-hidden">
      {/* Mystical gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 animate-mystical"></div>

      {/* Floating magical particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-200 rounded-full animate-sparkle opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        ></div>
      ))}

      {/* Floating stars */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute text-3xl opacity-40 animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Mystical glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-400 via-transparent to-transparent opacity-20 animate-glow"></div>

      <audio ref={audioRef} loop>
        <source src="/audio/fantasy.mp3" type="audio/mpeg" />
      </audio>

      <style jsx>{`
        @keyframes mystical {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(20deg); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
          50% { transform: scale(1.5) translateY(-20px); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-mystical {
          animation: mystical 10s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle linear infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle at 50% 50%, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
