'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function Header() {
  const { session, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
      <div
        className="flex items-center gap-8 px-6 py-3 rounded-2xl backdrop-blur-xl transition-all duration-200"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Link
          href="/"
          className="display-text text-xl font-semibold transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          BookScape
        </Link>

        <nav className="flex items-center gap-6">
          {!loading && session ? (
            <>
              <Link
                href="/library"
                className="transition-colors ui-text text-sm"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Library
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 rounded-lg text-sm transition-all duration-200 ui-text"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="transition-colors ui-text text-sm"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
