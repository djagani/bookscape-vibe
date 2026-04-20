'use client';

import { useEffect, useRef, useState } from 'react';
import type { World, EnvironmentScene } from '@/lib/types';
import CSSEnvironment from './CSSEnvironment';

interface DynamicEnvironmentProps {
  world: World;
  isMuted: boolean;
}

export default function DynamicEnvironment({ world, isMuted }: DynamicEnvironmentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [useCSSFallback, setUseCSSFallback] = useState(false);
  const scene = world.interpretation.environmentScene;
  const genre = world.interpretation.genre;

  // Default scene for old worlds without environmentScene
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

  // Fetch high-quality scene image from Unsplash with fallback queries
  useEffect(() => {
    async function fetchSceneImage() {
      try {
        // Try multiple search queries with decreasing specificity
        const queries = [
          `${activeScene.landscape} ${activeScene.timeOfDay} ${activeScene.atmosphere} cinematic`,
          `${activeScene.landscape} ${activeScene.weather} nature landscape`,
          `${activeScene.landscape} scenic photography`,
          `${activeScene.timeOfDay} landscape cinematic`,
        ];

        let imageFound = false;

        for (const query of queries) {
          if (imageFound) break;

          const res = await fetch(`/api/scene-image?query=${encodeURIComponent(query)}`);
          const data = await res.json();

          if (data.imageUrl) {
            console.log('[Environment] Image found with query:', query);
            setSceneImage(data.imageUrl);
            imageFound = true;
            break;
          }
        }

        if (!imageFound) {
          console.log('[Environment] No image found, using CSS scenic fallback');
          setUseCSSFallback(true);
        }

        setImageLoading(false);
      } catch (error) {
        console.error('[Environment] Failed to fetch scene image:', error);
        setImageLoading(false);
      }
    }

    fetchSceneImage();
  }, [activeScene.landscape, activeScene.weather, activeScene.timeOfDay, activeScene.atmosphere]);

  // Audio control (optional - gracefully fails if no audio file)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;

      // Handle audio loading errors silently
      audioRef.current.onerror = () => {
        console.log('[Environment] Audio file not found (this is optional)');
      };

      if (!isMuted) {
        audioRef.current.play().catch(() => {
          // Audio autoplay prevented or file not found - this is fine
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  // Get time-based overlay color
  const getTimeOverlay = () => {
    switch (activeScene.timeOfDay) {
      case 'dawn':
        return 'bg-orange-400 opacity-15';
      case 'dusk':
        return 'bg-purple-500 opacity-20';
      case 'night':
        return 'bg-blue-950 opacity-35';
      default:
        return '';
    }
  };

  // Get weather overlay
  const getWeatherOverlay = () => {
    switch (activeScene.weather) {
      case 'foggy':
        return 'bg-gray-200 opacity-25';
      case 'stormy':
        return 'bg-gray-900 opacity-30';
      case 'rainy':
        return 'bg-blue-900 opacity-15';
      case 'snowy':
        return 'bg-white opacity-10';
      default:
        return '';
    }
  };

  // Render special effects as subtle overlays
  const renderSpecialEffects = () => {
    if (!activeScene.specialEffects) return null;

    return activeScene.specialEffects.map((effect, idx) => {
      const effectLower = effect.toLowerCase();

      // Fireflies - subtle glowing particles
      if (effectLower.includes('firefl')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(10)].map((_, i) => (
              <div
                key={`firefly-${i}`}
                className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-firefly"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${30 + Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  boxShadow: '0 0 8px rgba(255, 255, 200, 0.8)',
                }}
              ></div>
            ))}
          </div>
        );
      }

      // Falling leaves/petals
      if (effectLower.includes('leaves') || effectLower.includes('petal')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(15)].map((_, i) => (
              <div
                key={`leaf-${i}`}
                className="absolute text-xl opacity-40 animate-fall-leaf"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 5}s`,
                }}
              >
                {effectLower.includes('petal') ? '🌸' : '🍂'}
              </div>
            ))}
          </div>
        );
      }

      // Rain
      if (effectLower.includes('rain')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(25)].map((_, i) => (
              <div
                key={`rain-${i}`}
                className="absolute w-px h-12 bg-blue-200 opacity-30 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        );
      }

      // Snow
      if (effectLower.includes('snow')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(20)].map((_, i) => (
              <div
                key={`snow-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-snow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-5%',
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>
        );
      }

      // Stars/Sparkles
      if (effectLower.includes('star') || effectLower.includes('sparkle') || effectLower.includes('magic')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(15)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
                }}
              ></div>
            ))}
          </div>
        );
      }

      // Lightning
      if (effectLower.includes('lightning')) {
        return (
          <div key={`effect-${idx}`} className="absolute inset-0">
            <div className="absolute inset-0 bg-white opacity-0 animate-lightning"></div>
          </div>
        );
      }

      // Floating lanterns
      if (effectLower.includes('lantern')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(8)].map((_, i) => (
              <div
                key={`lantern-${i}`}
                className="absolute w-2 h-3 bg-orange-300 rounded-sm animate-float-up"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '0%',
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${12 + Math.random() * 6}s`,
                  boxShadow: '0 0 10px rgba(255, 165, 0, 0.7)',
                }}
              ></div>
            ))}
          </div>
        );
      }

      // Birds
      if (effectLower.includes('bird')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(6)].map((_, i) => (
              <div
                key={`bird-${i}`}
                className="absolute text-xl opacity-50 animate-fly"
                style={{
                  left: '-10%',
                  top: `${15 + i * 10}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${18 + Math.random() * 5}s`,
                }}
              >
                🦅
              </div>
            ))}
          </div>
        );
      }

      // Fog wisps
      if (effectLower.includes('fog')) {
        return (
          <div key={`effect-${idx}`}>
            {[...Array(4)].map((_, i) => (
              <div
                key={`fog-${i}`}
                className="absolute w-64 h-24 bg-white opacity-5 rounded-full blur-2xl animate-fog"
                style={{
                  left: '-20%',
                  bottom: `${i * 25}%`,
                  animationDelay: `${i * 4}s`,
                  animationDuration: `${25 + i * 5}s`,
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

  // If CSS fallback is needed, render the pure CSS environment
  if (useCSSFallback && !imageLoading) {
    return <CSSEnvironment world={world} isMuted={isMuted} />;
  }

  return (
    <div className="dynamic-environment w-full h-screen relative overflow-hidden">
      {/* Loading state */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-white text-xl animate-pulse">Creating your immersive world...</div>
        </div>
      )}

      {/* High-quality scenic background with subtle ken-burns effect */}
      {sceneImage && (
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: `url(${sceneImage})`,
            transform: 'scale(1.1)',
          }}
        ></div>
      )}

      {/* Fallback gradient if image fails to load */}
      {!sceneImage && !imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-900"></div>
      )}

      {/* Time of day color overlay */}
      {getTimeOverlay() && (
        <div className={`absolute inset-0 ${getTimeOverlay()} animate-breathe`}></div>
      )}

      {/* Weather overlay */}
      {getWeatherOverlay() && (
        <div className={`absolute inset-0 ${getWeatherOverlay()} animate-pulse-slow`}></div>
      )}

      {/* Atmospheric vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50"></div>

      {/* Special effects layer */}
      <div className="absolute inset-0 pointer-events-none">
        {renderSpecialEffects()}
      </div>

      {/* Audio */}
      <audio ref={audioRef} loop>
        <source src={`/audio/${audioFile}.mp3`} type="audio/mpeg" />
      </audio>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at 50% 50%, var(--tw-gradient-stops));
        }

        @keyframes ken-burns {
          0% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.18) translate(-15px, -10px); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.35; }
        }
        @keyframes firefly {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          25% { transform: translate(15px, -10px); opacity: 0.9; }
          50% { transform: translate(30px, -20px); opacity: 0.5; }
          75% { transform: translate(15px, -30px); opacity: 0.9; }
        }
        @keyframes fall-leaf {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes rain {
          0% { transform: translateY(0); opacity: 0.3; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes snow {
          0% { transform: translateY(0) translateX(0); opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(40px); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          92% { opacity: 0.4; }
          94% { opacity: 0; }
          96% { opacity: 0.9; }
          98% { opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translateY(0); opacity: 0.7; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
        @keyframes fly {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(60vw) translateY(-15px); }
          100% { transform: translateX(120vw) translateY(0); }
        }
        @keyframes fog {
          0% { transform: translateX(0); opacity: 0.05; }
          50% { transform: translateX(60vw); opacity: 0.10; }
          100% { transform: translateX(120vw); opacity: 0.05; }
        }

        .animate-ken-burns { animation: ken-burns 70s ease-in-out infinite; }
        .animate-breathe { animation: breathe 10s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 7s ease-in-out infinite; }
        .animate-firefly { animation: firefly 7s ease-in-out infinite; }
        .animate-fall-leaf { animation: fall-leaf linear infinite; }
        .animate-rain { animation: rain 1.3s linear infinite; }
        .animate-snow { animation: snow linear infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-lightning { animation: lightning 12s ease-in-out infinite; }
        .animate-float-up { animation: float-up linear infinite; }
        .animate-fly { animation: fly linear infinite; }
        .animate-fog { animation: fog linear infinite; }
      `}</style>
    </div>
  );
}
