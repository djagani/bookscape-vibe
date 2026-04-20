import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Unsplash API - get your free key from https://unsplash.com/developers
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey || accessKey === 'your-unsplash-access-key-here') {
      console.log('[Scene Image] Unsplash API key not configured');
      return NextResponse.json({
        imageUrl: null,
        error: 'API key not configured',
      });
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${accessKey}`;

    console.log('[Scene Image] Searching Unsplash for:', query);

    const res = await fetch(url);
    const data = await res.json();

    // Check for rate limit
    if (res.status === 403 || res.status === 429) {
      console.warn('[Scene Image] Unsplash rate limit reached');
      return NextResponse.json({
        imageUrl: null,
        error: 'Rate limit reached',
      });
    }

    if (!res.ok) {
      console.error('[Scene Image] Unsplash API error:', data);
      return NextResponse.json({
        imageUrl: null,
        error: 'API error',
      });
    }

    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      console.log('[Scene Image] Found image by:', photo.user.name);
      return NextResponse.json({
        imageUrl: photo.urls.regular,
        imageUrlFull: photo.urls.full,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
      });
    }

    // No results found for this query
    console.log('[Scene Image] No results found for query:', query);
    return NextResponse.json({
      imageUrl: null,
      error: 'No image found',
    });
  } catch (error) {
    console.error('[Scene Image] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
