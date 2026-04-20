import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const redirectPath = searchParams.get('redirect') || '/';

    const authUrl = getSpotifyAuthUrl(redirectPath);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Spotify login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Spotify authentication' },
      { status: 500 }
    );
  }
}
