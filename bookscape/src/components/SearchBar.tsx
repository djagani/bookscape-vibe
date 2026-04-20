'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

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
          bookCover: data.bookCover,
        })
      );

      router.push('/world/new');
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <div
          className="flex items-center backdrop-blur-xl transition-all duration-200"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            height: '56px',
            width: 'min(680px, 90vw)',
            margin: '0 auto',
          }}
        >
          <input
            type="text"
            placeholder="Search for a book, author, or quote..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-6 bg-transparent"
            style={{
              color: 'white',
              fontFamily: "'Inter', sans-serif",
              fontSize: '15px',
              outline: 'none',
              border: 'none',
            }}
            onFocus={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                parent.style.borderColor = 'rgba(255, 255, 255, 0.20)';
              }
            }}
            onBlur={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                parent.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !query}
            className="mr-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            <SearchIcon fontSize="small" />
          </button>
        </div>
      </form>
      {error && <p className="text-sm text-center" style={{ color: '#ef4444', fontFamily: "'Inter', sans-serif" }}>{error}</p>}
      {loading && (
        <p className="text-sm text-center" style={{ color: 'rgba(255, 255, 255, 0.55)', fontFamily: "'Inter', sans-serif" }}>
          Generating your world...
        </p>
      )}
    </div>
  );
}
