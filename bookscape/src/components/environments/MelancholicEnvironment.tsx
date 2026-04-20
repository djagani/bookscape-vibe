'use client';

import { useEffect, useRef } from 'react';
import type { World } from '@/lib/types';

interface EnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function MelancholicEnvironment({ world, isMuted }: EnvironmentProps) {
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
    <div className="melancholic-environment w-full h-screen relative overflow-hidden">
      {/* Somber, blue-grey background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-blue-gray-800 to-gray-900 animate-sorrow"></div>

      {/* Falling rain */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-12 bg-blue-200 opacity-30 animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 0.5}s`,
          }}
        ></div>
      ))}

      {/* Clouds moving slowly */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute w-32 h-16 bg-gray-600 opacity-20 rounded-full blur-xl animate-cloud"
          style={{
            top: `${10 + i * 15}%`,
            left: `-10%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${30 + i * 5}s`,
          }}
        ></div>
      ))}

      {/* Fog effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50 animate-mist"></div>

      {/* Ripple effects */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`ripple-${i}`}
          className="absolute w-2 h-2 bg-blue-300 rounded-full animate-ripple opacity-20"
          style={{
            left: `${20 + i * 10}%`,
            bottom: '10%',
            animationDelay: `${i * 1.5}s`,
          }}
        ></div>
      ))}

      <audio ref={audioRef} loop>
        <source src="/audio/melancholic.mp3" type="audio/mpeg" />
      </audio>

      <style jsx>{`
        @keyframes sorrow {
          0%, 100% { filter: brightness(0.7) saturate(0.8); }
          50% { filter: brightness(0.6) saturate(0.6); }
        }
        @keyframes rain {
          0% { transform: translateY(0); opacity: 0.3; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes cloud {
          0% { transform: translateX(0); }
          100% { transform: translateX(120vw); }
        }
        @keyframes mist {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-20px); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(8); opacity: 0; }
        }
        .animate-sorrow {
          animation: sorrow 6s ease-in-out infinite;
        }
        .animate-rain {
          animation: rain linear infinite;
        }
        .animate-cloud {
          animation: cloud linear infinite;
        }
        .animate-mist {
          animation: mist 10s ease-in-out infinite;
        }
        .animate-ripple {
          animation: ripple 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
}
