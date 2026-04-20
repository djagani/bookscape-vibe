'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import type { GoogleBooksResult } from '@/lib/types';

export default function UnifiedSearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState<GoogleBooksResult[]>([]);
  const [generatingBook, setGeneratingBook] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setBooks([]);

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate interpretation');
        setLoading(false);
        return;
      }

      // If author search, show book selection
      if (data.type === 'author') {
        setBooks(data.books);
        setLoading(false);
        return;
      }

      // Otherwise, directly show the world
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

  const handleBookSelect = async (book: GoogleBooksResult) => {
    setGeneratingBook(`${book.title}-${book.author}`);

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: book.title,
          bookAuthor: book.author,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate interpretation');
        setGeneratingBook(null);
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
      setGeneratingBook(null);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
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
        </div>
        {error && <p className="text-sm text-center" style={{ color: '#ef4444', fontFamily: "'Inter', sans-serif" }}>{error}</p>}
        {loading && (
          <p className="text-sm text-center" style={{ color: 'rgba(255, 255, 255, 0.55)', fontFamily: "'Inter', sans-serif" }}>
            Generating your world...
          </p>
        )}
      </form>

      {books.length > 0 && (
        <div className="mt-8">
          <h2
            className="text-2xl font-semibold mb-6 text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            Select a book by this author:
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {books.map((book) => {
              const bookKey = `${book.title}-${book.author}`;
              const isGenerating = generatingBook === bookKey;

              return (
                <button
                  key={bookKey}
                  onClick={() => handleBookSelect(book)}
                  disabled={isGenerating}
                  className="p-4 rounded-2xl transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    background: 'rgba(10, 10, 15, 0.55)',
                    backdropFilter: 'blur(18px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 10, 15, 0.55)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {book.imageLinks?.thumbnail && (
                    <img
                      src={book.imageLinks.thumbnail}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3
                    className="font-semibold text-sm mb-1 line-clamp-2"
                    style={{
                      fontFamily: "'Lora', serif",
                      color: 'rgba(255, 255, 255, 0.90)',
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    className="text-xs mb-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: 'rgba(255, 255, 255, 0.60)',
                    }}
                  >
                    {book.author}
                  </p>
                  {isGenerating && (
                    <p
                      className="text-xs mt-2"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: 'rgba(255, 255, 255, 0.75)',
                      }}
                    >
                      Generating world...
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
