'use client';

import { useEffect, useRef } from 'react';
import type { World } from '@/lib/types';

interface EnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function HistoricalEnvironment({ world, isMuted }: EnvironmentProps) {
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
    <div className="historical-environment w-full h-screen relative overflow-hidden">
      {/* Ancient, warm background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-yellow-900 to-orange-900 animate-ancient"></div>

      {/* Floating scrolls/manuscripts */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-20 animate-drift"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          {i % 4 === 0 ? '📜' : i % 4 === 1 ? '🏛️' : i % 4 === 2 ? '⚔️' : '🗿'}
        </div>
      ))}

      {/* Papyrus texture overlay */}
      <div
        className="absolute inset-0 opacity-10 animate-texture"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(139, 69, 19, 0.1) 0px,
            transparent 1px,
            transparent 2px,
            rgba(139, 69, 19, 0.1) 3px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(139, 69, 19, 0.1) 0px,
            transparent 1px,
            transparent 2px,
            rgba(139, 69, 19, 0.1) 3px
          )`
        }}
      ></div>

      {/* Floating dust particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-dust opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        ></div>
      ))}

      {/* Warm glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-300 via-transparent to-transparent opacity-15 animate-warmth"></div>

      <audio ref={audioRef} loop>
        <source src="/audio/historical.mp3" type="audio/mpeg" />
      </audio>

      <style jsx>{`
        @keyframes ancient {
          0%, 100% { filter: sepia(0.3); }
          50% { filter: sepia(0.5); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(5deg); }
          50% { transform: translate(0, -40px) rotate(-5deg); }
          75% { transform: translate(-20px, -20px) rotate(5deg); }
        }
        @keyframes texture {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes dust {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
        }
        @keyframes warmth {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-ancient {
          animation: ancient 8s ease-in-out infinite;
        }
        .animate-drift {
          animation: drift linear infinite;
        }
        .animate-texture {
          animation: texture 5s ease-in-out infinite;
        }
        .animate-dust {
          animation: dust linear infinite;
        }
        .animate-warmth {
          animation: warmth 4s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle at 50% 30%, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
