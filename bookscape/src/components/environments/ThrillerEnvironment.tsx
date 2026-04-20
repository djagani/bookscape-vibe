'use client';

import { useEffect, useRef } from 'react';
import type { World } from '@/lib/types';

interface EnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function ThrillerEnvironment({ world, isMuted }: EnvironmentProps) {
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
    <div className="thriller-environment w-full h-screen relative overflow-hidden">
      {/* Dark, moody background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-black animate-tension"></div>

      {/* Flickering shadows */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-32 bg-black opacity-30 animate-flicker"
          style={{
            top: `${i * 15}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        ></div>
      ))}

      {/* Fog effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-700 via-transparent to-transparent opacity-40 animate-fog"></div>

      {/* Subtle light rays */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-full bg-white opacity-5 animate-beam"
            style={{
              left: `${20 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          ></div>
        ))}
      </div>

      <audio ref={audioRef} loop>
        <source src="/audio/thriller.mp3" type="audio/mpeg" />
      </audio>

      <style jsx>{`
        @keyframes tension {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(0.8); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }
        @keyframes fog {
          0%, 100% { transform: translateX(0); opacity: 0.4; }
          50% { transform: translateX(50px); opacity: 0.6; }
        }
        @keyframes beam {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        .animate-tension {
          animation: tension 4s ease-in-out infinite;
        }
        .animate-flicker {
          animation: flicker ease-in-out infinite;
        }
        .animate-fog {
          animation: fog 20s ease-in-out infinite;
        }
        .animate-beam {
          animation: beam 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
