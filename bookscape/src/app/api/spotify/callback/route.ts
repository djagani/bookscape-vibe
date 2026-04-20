import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the redirect path
    const error = searchParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      return NextResponse.redirect(new URL('/?spotify_error=access_denied', request.url));
    }

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    // Exchange code for tokens
    const tokenData = await exchangeCodeForToken(code);

    // Create response with redirect
    const redirectUrl = new URL(state || '/', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set tokens in HTTP-only cookies
    const maxAge = tokenData.expires_in; // Spotify tokens typically last 1 hour

    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    if (tokenData.refresh_token) {
      // Refresh token doesn't expire, but we'll set a long max age
      response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Spotify callback error:', error);
    return NextResponse.redirect(new URL('/?spotify_error=auth_failed', request.url));
  }
}
