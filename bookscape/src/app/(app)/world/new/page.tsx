'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { World, Interpretation, GoogleBooksResult } from '@/lib/types';
import WorldDisplay from '@/components/WorldDisplay';

interface CurrentWorld {
  interpretation: Interpretation;
  bookData?: GoogleBooksResult;
  bookCover?: string | null;
}

export default function NewWorldPage() {
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('currentWorld');
    if (!stored) {
      router.push('/');
      return;
    }

    const data = JSON.parse(stored) as CurrentWorld;
    const world: World = {
      id: 'new',
      userId: '',
      bookTitle: data.interpretation.bookTitle,
      author: data.interpretation.author,
      bookCover: data.bookCover || null,
      interpretation: data.interpretation,
      createdAt: new Date().toISOString(),
    };

    setWorld(world);
    setLoading(false);
  }, [router]);

  if (loading || !world) {
    return <div className="p-8 text-center">Loading world...</div>;
  }

  return <WorldDisplay world={world} />;
}
