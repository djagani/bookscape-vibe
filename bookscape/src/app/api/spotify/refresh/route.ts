import { NextRequest, NextResponse } from 'next/server';
import { refreshSpotifyToken } from '@/lib/spotify';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('spotify_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 401 }
      );
    }

    // Get new access token
    const tokenData = await refreshSpotifyToken(refreshToken);

    // Create response
    const response = NextResponse.json({ success: true });

    // Update access token cookie
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
      path: '/',
    });

    // Update refresh token if a new one was provided
    if (tokenData.refresh_token) {
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
    console.error('Spotify refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
