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
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          BookScape
        </Link>

        <nav className="flex items-center gap-6">
          {!loading && session ? (
            <>
              <Link href="/library" className="text-gray-300 hover:text-white">
                Library
              </Link>
              <Button variant="secondary" onClick={handleSignOut} className="text-sm">
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/signin" className="text-gray-300 hover:text-white">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
