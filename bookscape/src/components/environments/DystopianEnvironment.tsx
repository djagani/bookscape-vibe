'use client';

import { useEffect, useRef } from 'react';
import type { World } from '@/lib/types';

interface EnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function DystopianEnvironment({ world, isMuted }: EnvironmentProps) {
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
    <div className="dystopian-environment w-full h-screen relative overflow-hidden">
      {/* Industrial, gritty background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-gray-900 animate-dystopia"></div>

      {/* Falling ash/particles */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gray-400 rounded-full animate-fall opacity-50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 5}s`,
          }}
        ></div>
      ))}

      {/* Glitch overlay */}
      <div className="absolute inset-0 bg-red-500 opacity-5 animate-glitch"></div>

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-orange-500"
            style={{ top: `${i * 10}%` }}
          ></div>
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px h-full bg-orange-500"
            style={{ left: `${i * 10}%` }}
          ></div>
        ))}
      </div>

      {/* Warning lights */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`light-${i}`}
          className="absolute w-4 h-4 bg-red-500 rounded-full animate-blink opacity-60"
          style={{
            top: `${20 + i * 20}%`,
            right: '5%',
            animationDelay: `${i * 0.5}s`,
          }}
        ></div>
      ))}

      <audio ref={audioRef} loop>
        <source src="/audio/dystopian.mp3" type="audio/mpeg" />
      </audio>

      <style jsx>{`
        @keyframes dystopia {
          0%, 100% { filter: contrast(1.1); }
          50% { filter: contrast(1.3); }
        }
        @keyframes fall {
          0% { transform: translateY(0); opacity: 0.5; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); opacity: 0.05; }
          25% { transform: translateX(-2px); opacity: 0.1; }
          75% { transform: translateX(2px); opacity: 0.1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
        .animate-dystopia {
          animation: dystopia 5s ease-in-out infinite;
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        .animate-glitch {
          animation: glitch 0.3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
