'use client';

import { useEffect, useRef } from 'react';
import type { World, EnvironmentScene } from '@/lib/types';

interface CSSEnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function CSSEnvironment({ world, isMuted }: CSSEnvironmentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const scene = world.interpretation.environmentScene;
  const genre = world.interpretation.genre;

  const defaultScene: EnvironmentScene = {
    setting: 'mystical landscape',
    timeOfDay: 'dusk',
    weather: 'clear',
    landscape: 'forest',
    atmosphere: 'magical',
    specialEffects: ['fireflies', 'stars'],
    description: 'A magical landscape with twinkling lights'
  };

  const activeScene = scene || defaultScene;

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

  // Render detailed CSS scenic backgrounds based on landscape
  const renderSceneBackground = () => {
    const { landscape, timeOfDay, weather } = activeScene;

    // Sky colors based on time
    const getSkyColors = () => {
      switch (timeOfDay) {
        case 'dawn':
          return 'from-orange-400 via-pink-400 to-purple-500';
        case 'day':
          return 'from-sky-400 via-blue-400 to-cyan-500';
        case 'dusk':
          return 'from-purple-500 via-orange-500 to-pink-600';
        case 'night':
          return 'from-indigo-900 via-purple-900 to-black';
        default:
          return 'from-sky-400 via-blue-400 to-cyan-500';
      }
    };

    switch (landscape) {
      case 'forest':
        return (
          <>
            {/* Sky */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getSkyColors()}`}></div>

            {/* Mountains in background */}
            <div className="absolute bottom-0 left-0 right-0 h-2/5">
              <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[300px] border-l-transparent border-r-[300px] border-r-transparent border-b-[200px] border-b-green-900 opacity-40"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[350px] border-l-transparent border-r-[350px] border-r-transparent border-b-[250px] border-b-green-800 opacity-40"></div>
            </div>

            {/* Forest layers */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3">
              {/* Back layer trees */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={`tree-back-${i}`}
                  className="absolute bottom-0"
                  style={{
                    left: `${i * 10}%`,
                    width: '80px',
                    height: `${180 + Math.random() * 60}px`,
                  }}
                >
                  <div className="absolute bottom-0 w-3 h-full bg-green-950 left-1/2 -translate-x-1/2 opacity-60"></div>
                  <div className="absolute bottom-16 w-16 h-20 bg-green-900 rounded-full left-1/2 -translate-x-1/2 opacity-60 animate-sway-slow"></div>
                </div>
              ))}

              {/* Mid layer trees */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`tree-mid-${i}`}
                  className="absolute bottom-0"
                  style={{
                    left: `${5 + i * 13}%`,
                    width: '100px',
                    height: `${220 + Math.random() * 80}px`,
                  }}
                >
                  <div className="absolute bottom-0 w-4 h-full bg-green-900 left-1/2 -translate-x-1/2"></div>
                  <div className="absolute bottom-20 w-20 h-24 bg-green-800 rounded-full left-1/2 -translate-x-1/2 animate-sway-medium" style={{ animationDelay: `${i * 0.3}s` }}></div>
                  <div className="absolute bottom-28 w-16 h-20 bg-green-700 rounded-full left-1/2 -translate-x-1/2 animate-sway-medium" style={{ animationDelay: `${i * 0.3}s` }}></div>
                </div>
              ))}

              {/* Foreground trees */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={`tree-front-${i}`}
                  className="absolute bottom-0"
                  style={{
                    left: `${i * 22}%`,
                    width: '120px',
                    height: `${280 + Math.random() * 100}px`,
                  }}
                >
                  <div className="absolute bottom-0 w-5 h-full bg-amber-900 left-1/2 -translate-x-1/2"></div>
                  <div className="absolute bottom-24 w-24 h-28 bg-green-700 rounded-full left-1/2 -translate-x-1/2 animate-sway-fast" style={{ animationDelay: `${i * 0.5}s` }}></div>
                  <div className="absolute bottom-32 w-20 h-24 bg-green-600 rounded-full left-1/2 -translate-x-1/2 animate-sway-fast" style={{ animationDelay: `${i * 0.5}s` }}></div>
                </div>
              ))}
            </div>

            {/* Ground/grass */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-950 to-transparent"></div>
          </>
        );

      case 'castle':
        return (
          <>
            {/* Sky */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getSkyColors()}`}></div>

            {/* Castle silhouette */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl">
              {/* Main keep */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-96 bg-gray-900 opacity-80"></div>
              <div className="absolute bottom-96 left-1/2 -translate-x-1/2 w-48 h-16">
                <div className="w-12 h-16 bg-gray-900 opacity-80 inline-block"></div>
                <div className="w-12 h-8 bg-transparent inline-block"></div>
                <div className="w-12 h-16 bg-gray-900 opacity-80 inline-block"></div>
                <div className="w-12 h-8 bg-transparent inline-block"></div>
                <div className="w-12 h-16 bg-gray-900 opacity-80 inline-block"></div>
              </div>

              {/* Towers */}
              <div className="absolute bottom-0 left-1/4 w-20 h-80 bg-gray-800 opacity-80"></div>
              <div className="absolute bottom-80 left-1/4 w-20 h-12 bg-gray-700 opacity-80" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>

              <div className="absolute bottom-0 right-1/4 w-20 h-80 bg-gray-800 opacity-80"></div>
              <div className="absolute bottom-80 right-1/4 w-20 h-12 bg-gray-700 opacity-80" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>

              {/* Windows with light */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`window-${i}`}
                  className="absolute w-3 h-4 bg-yellow-200 animate-window-glow"
                  style={{
                    left: `${30 + (i % 4) * 20}%`,
                    bottom: `${100 + Math.floor(i / 4) * 60}px`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-stone-900 to-transparent"></div>
          </>
        );

      case 'city':
        return (
          <>
            {/* Sky */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getSkyColors()}`}></div>

            {/* Building silhouettes */}
            {[...Array(15)].map((_, i) => {
              const height = 200 + Math.random() * 300;
              const width = 40 + Math.random() * 60;
              return (
                <div
                  key={`building-${i}`}
                  className="absolute bottom-0 bg-gray-900 opacity-70"
                  style={{
                    left: `${i * 7}%`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                >
                  {/* Windows */}
                  {[...Array(Math.floor(height / 40))].map((_, j) => (
                    <div
                      key={`win-${j}`}
                      className="absolute w-2 h-2 bg-yellow-300 animate-city-lights"
                      style={{
                        left: '50%',
                        top: `${20 + j * 40}px`,
                        animationDelay: `${(i + j) * 0.3}s`,
                      }}
                    ></div>
                  ))}
                </div>
              );
            })}

            {/* Fog layer */}
            <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-gray-800 via-gray-700 to-transparent opacity-40"></div>
          </>
        );

      case 'mountains':
        return (
          <>
            {/* Sky */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getSkyColors()}`}></div>

            {/* Mountain layers */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`mountain-${i}`}
                className="absolute bottom-0"
                style={{
                  left: `${i * 18 - 10}%`,
                  width: 0,
                  height: 0,
                  borderLeft: `${200 + i * 40}px solid transparent`,
                  borderRight: `${200 + i * 40}px solid transparent`,
                  borderBottom: `${250 + i * 60}px solid`,
                  borderBottomColor: `rgb(${100 - i * 10}, ${110 - i * 10}, ${120 - i * 10})`,
                  opacity: 0.9 - i * 0.1,
                }}
              ></div>
            ))}

            {/* Snow caps */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`snow-${i}`}
                className="absolute"
                style={{
                  left: `${i * 20 + 10}%`,
                  bottom: `${280 + i * 50}px`,
                  width: 0,
                  height: 0,
                  borderLeft: `${40 + i * 10}px solid transparent`,
                  borderRight: `${40 + i * 10}px solid transparent`,
                  borderBottom: `${50 + i * 15}px solid white`,
                  opacity: 0.8,
                }}
              ></div>
            ))}
          </>
        );

      case 'ocean':
        return (
          <>
            {/* Sky */}
            <div className={`absolute inset-0 bg-gradient-to-b ${getSkyColors()}`}></div>

            {/* Horizon line */}
            <div className="absolute bottom-1/3 w-full h-px bg-blue-300 opacity-30"></div>

            {/* Ocean waves */}
            <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`wave-${i}`}
                  className="absolute w-full h-24 opacity-30 animate-wave"
                  style={{
                    bottom: `${i * 15}%`,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    animationDelay: `${i * 0.5}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* Sun/Moon reflection */}
            <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-2 h-64 bg-gradient-to-b from-yellow-200 to-transparent opacity-40 animate-shimmer"></div>
          </>
        );

      default:
        return (
          <>
            <div className={`absolute inset-0 bg-gradient-to-b ${getSkyColors()}`}></div>
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-900 to-transparent"></div>
          </>
        );
    }
  };

  // Render weather and special effects
  const renderEffects = () => {
    if (!activeScene.specialEffects) return null;

    return activeScene.specialEffects.map((effect, idx) => {
      const effectLower = effect.toLowerCase();

      if (effectLower.includes('firefl')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(12)].map((_, i) => (
              <div
                key={`firefly-${i}`}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-firefly"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${30 + Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  boxShadow: '0 0 10px rgba(255, 255, 150, 0.9)',
                }}
              ></div>
            ))}
          </div>
        );
      }

      if (effectLower.includes('star')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(20)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  boxShadow: '0 0 4px white',
                }}
              ></div>
            ))}
          </div>
        );
      }

      if (effectLower.includes('rain')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(30)].map((_, i) => (
              <div
                key={`rain-${i}`}
                className="absolute w-px h-16 bg-blue-200 opacity-40 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        );
      }

      if (effectLower.includes('snow')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(25)].map((_, i) => (
              <div
                key={`snow-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-snow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>
        );
      }

      return null;
    });
  };

  const audioFile = genre?.toLowerCase().replace('/', '-') || 'fantasy';

  return (
    <div className="css-environment w-full h-screen relative overflow-hidden">
      {/* Scene background */}
      {renderSceneBackground()}

      {/* Time/weather overlays */}
      {activeScene.timeOfDay === 'night' && (
        <div className="absolute inset-0 bg-blue-950 opacity-25 animate-breathe"></div>
      )}
      {activeScene.weather === 'foggy' && (
        <div className="absolute inset-0 bg-gray-300 opacity-20 animate-pulse-slow"></div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-40"></div>

      {/* Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {renderEffects()}
      </div>

      {/* Sun/Moon */}
      {activeScene.timeOfDay === 'day' && (
        <div className="absolute top-24 right-32 w-16 h-16 bg-yellow-200 rounded-full animate-pulse-slow" style={{ boxShadow: '0 0 60px rgba(255, 255, 150, 0.8)' }}></div>
      )}
      {activeScene.timeOfDay === 'night' && (
        <div className="absolute top-24 right-32 w-14 h-14 bg-gray-100 rounded-full" style={{ boxShadow: '0 0 40px rgba(255, 255, 255, 0.5)' }}></div>
      )}

      <audio ref={audioRef} loop>
        <source src={`/audio/${audioFile}.mp3`} type="audio/mpeg" />
      </audio>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at 50% 50%, var(--tw-gradient-stops));
        }

        @keyframes sway-slow { 0%, 100% { transform: translateX(-50%) rotate(-1deg); } 50% { transform: translateX(-50%) rotate(1deg); } }
        @keyframes sway-medium { 0%, 100% { transform: translateX(-50%) rotate(-2deg); } 50% { transform: translateX(-50%) rotate(2deg); } }
        @keyframes sway-fast { 0%, 100% { transform: translateX(-50%) rotate(-3deg); } 50% { transform: translateX(-50%) rotate(3deg); } }
        @keyframes window-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes city-lights { 0%, 100% { opacity: 0.9; } 50% { opacity: 0.3; } }
        @keyframes wave { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(50px); } }
        @keyframes shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.6; } }
        @keyframes breathe { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.35; } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
        @keyframes firefly { 0%, 100% { transform: translate(0, 0); opacity: 0.6; } 25% { transform: translate(20px, -15px); opacity: 1; } 50% { transform: translate(40px, -30px); opacity: 0.6; } 75% { transform: translate(20px, -45px); opacity: 1; } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes rain { 0% { transform: translateY(0); opacity: 0.4; } 100% { transform: translateY(110vh); opacity: 0; } }
        @keyframes snow { 0% { transform: translateY(0) translateX(0); opacity: 0.7; } 100% { transform: translateY(110vh) translateX(40px); opacity: 0; } }

        .animate-sway-slow { animation: sway-slow 6s ease-in-out infinite; }
        .animate-sway-medium { animation: sway-medium 4s ease-in-out infinite; }
        .animate-sway-fast { animation: sway-fast 3s ease-in-out infinite; }
        .animate-window-glow { animation: window-glow 4s ease-in-out infinite; }
        .animate-city-lights { animation: city-lights 3s ease-in-out infinite; }
        .animate-wave { animation: wave 8s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 4s ease-in-out infinite; }
        .animate-breathe { animation: breathe 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-firefly { animation: firefly 7s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-rain { animation: rain 1.5s linear infinite; }
        .animate-snow { animation: snow linear infinite; }
      `}</style>
    </div>
  );
}
