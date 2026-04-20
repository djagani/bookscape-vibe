'use client';

import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/landingpg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Content - NO navbar on landing page */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-8 px-4">
        <div className="text-center animate-fadeInUp">
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: 'white',
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              fontWeight: 400,
              letterSpacing: '0.08em',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              lineHeight: '1.1',
              marginBottom: '1rem',
            }}
          >
            BOOKSCAPE
          </h1>
          <p
            className="animate-delay-200 animate-fadeInUp"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '1.2rem',
              letterSpacing: '0.02em',
            }}
          >
            Discover the world within every book
          </p>
        </div>

        <div className="w-full max-w-[680px] animate-delay-400 animate-fadeInUp">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
