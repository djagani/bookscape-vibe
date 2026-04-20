'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    router.push('/signin?confirmed=true');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Email Confirmed!</h1>
        <p className="text-gray-400">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
