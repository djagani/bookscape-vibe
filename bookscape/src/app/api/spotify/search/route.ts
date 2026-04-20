import { NextRequest, NextResponse } from 'next/server';
import { searchSpotify } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('spotify_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Spotify' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query required' },
        { status: 400 }
      );
    }

    // Search Spotify
    const results = await searchSpotify(query, accessToken);

    // Format response
    return NextResponse.json({
      playlists: results.playlists?.items || [],
      tracks: results.tracks?.items || [],
    });
  } catch (error: any) {
    console.error('Spotify search error:', error);

    // Check if token expired
    if (error.message?.includes('401')) {
      return NextResponse.json(
        { error: 'Token expired', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
