'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [signUpMode, setSignUpMode] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      setMessage('✓ Email confirmed! Now sign in below.');
      setSignUpMode(false);
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      console.log('Attempting sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        setLoading(false);
      } else if (data.session) {
        console.log('Sign in successful, redirecting...');
        setMessage('✓ Signed in! Redirecting...');
        // Use window.location for a hard redirect
        setTimeout(() => {
          window.location.href = '/library';
        }, 500);
      } else {
        setError('Sign in failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setMessage('✓ Check your email to confirm, then sign in');
        setSignUpMode(false);
        setPassword('');
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8">BookScape</h1>
        
        <form onSubmit={signUpMode ? handleSignUp : handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-slate-700 text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-slate-700 text-white placeholder-gray-400"
            required
          />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
          
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (signUpMode ? 'Signing up...' : 'Signing in...') : (signUpMode ? 'Sign Up' : 'Sign In')}
            </Button>
            <Button 
              type="button"
              variant="secondary" 
              onClick={() => {
                setSignUpMode(!signUpMode);
                setError('');
                setMessage('');
              }} 
              disabled={loading}
              className="flex-1"
            >
              {signUpMode ? 'Back' : 'New?'}
            </Button>
          </div>
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          {signUpMode 
            ? 'Create an account to save your worlds' 
            : 'Sign in to access your saved worlds'}
        </p>
      </div>
    </div>
  );
}
