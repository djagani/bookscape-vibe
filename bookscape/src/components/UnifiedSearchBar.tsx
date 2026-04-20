'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
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
        <input
          type="text"
          placeholder="Search by book title, author, or quote..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 border border-slate-700 focus:border-blue-500 outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={loading || !query} className="w-full">
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {books.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select a book:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((book) => {
              const bookKey = `${book.title}-${book.author}`;
              const isGenerating = generatingBook === bookKey;

              return (
                <button
                  key={bookKey}
                  onClick={() => handleBookSelect(book)}
                  disabled={isGenerating}
                  className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition border border-slate-700 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {book.imageLinks?.thumbnail && (
                    <img
                      src={book.imageLinks.thumbnail}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-400">{book.author}</p>
                  {isGenerating && (
                    <p className="text-xs text-blue-400 mt-2">Generating...</p>
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
