'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          type: 'search',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate interpretation');
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        'currentWorld',
        JSON.stringify({
          interpretation: data.interpretation,
          bookData: data.bookData,
        })
      );

      router.push('/world/new');
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <input
        type="text"
        placeholder="Search for a book (title or author)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-slate-700 focus:border-blue-500 outline-none"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button type="submit" disabled={loading || !query} className="w-full">
        {loading ? 'Generating...' : 'Generate Interpretation'}
      </Button>
    </form>
  );
}
