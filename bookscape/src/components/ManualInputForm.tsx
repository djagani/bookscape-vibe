'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SendIcon from '@mui/icons-material/Send';

export default function ManualInputForm() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customInput: input,
          type: 'manual',
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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="backdrop-blur-xl transition-all duration-200 rounded-2xl shadow-2xl"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <textarea
            placeholder="Enter a quote, theme, or description..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full px-6 py-4 bg-transparent outline-none resize-none ui-text"
            style={{
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                parent.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }
            }}
            onBlur={(e) => {
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                parent.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input}
          className="w-full px-6 py-3 rounded-xl font-medium text-sm backdrop-blur-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 ui-text shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            if (!loading && input) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          {loading ? 'Generating...' : (
            <>
              Generate <SendIcon fontSize="small" />
            </>
          )}
        </button>
      </form>
      {error && <p className="text-sm text-center" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}
