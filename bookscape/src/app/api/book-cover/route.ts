import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title');
    const author = searchParams.get('author');

    if (!title) {
      return NextResponse.json({ error: 'Book title required' }, { status: 400 });
    }

    // Unsplash API - get your free key from https://unsplash.com/developers
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey || accessKey === 'your-unsplash-access-key-here') {
      console.log('[Book Cover] Unsplash API key not configured');
      return NextResponse.json({
        coverUrl: null,
        error: 'API key not configured',
      });
    }

    // Try multiple search strategies for better book cover results
    const queries = [
      `${title} ${author} book cover`,
      `${title} book cover`,
      `${title} ${author}`,
    ];

    for (const query of queries) {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait&client_id=${accessKey}`;

      console.log('[Book Cover] Searching Unsplash for:', query);

      const res = await fetch(url);

      // Check for rate limit
      if (res.status === 403 || res.status === 429) {
        console.warn('[Book Cover] Unsplash rate limit reached');
        return NextResponse.json({
          coverUrl: null,
          error: 'Rate limit reached',
        });
      }

      if (!res.ok) {
        continue;
      }

      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        console.log('[Book Cover] Found cover image by:', photo.user.name);
        return NextResponse.json({
          coverUrl: photo.urls.regular,
          coverUrlFull: photo.urls.full,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        });
      }
    }

    // No results found for any query
    console.log('[Book Cover] No cover image found');
    return NextResponse.json({
      coverUrl: null,
      error: 'No image found',
    });
  } catch (error) {
    console.error('[Book Cover] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cover' },
      { status: 500 }
    );
  }
}
