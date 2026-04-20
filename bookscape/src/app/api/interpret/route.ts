import { NextRequest, NextResponse } from 'next/server';
import { searchGoogleBooks, searchBooksByAuthor, generateInterpretation, identifyBookFromQuote, detectSearchType } from '@/lib/api-clients';

export async function POST(request: NextRequest) {
  try {
    const { query, bookTitle, bookAuthor } = await request.json();

    // If specific book is selected, generate world for it
    if (bookTitle && bookAuthor) {
      const bookData = await searchGoogleBooks(`${bookTitle} ${bookAuthor}`);
      const interpretation = await generateInterpretation(
        `${bookTitle} by ${bookAuthor}`,
        bookData ?? undefined
      );

      return NextResponse.json({
        interpretation,
        bookData,
      });
    }

    console.log('Searching for:', query);

    // Detect what type of search this is
    const searchType = await detectSearchType(query);
    console.log('Detected search type:', searchType);

    let bookData = null;

    // Handle based on search type
    if (searchType === 'author') {
      console.log('Author search detected');
      const authorBooks = await searchBooksByAuthor(query);
      console.log('Author books found:', authorBooks.length);

      if (authorBooks.length >= 2) {
        return NextResponse.json({
          type: 'author',
          books: authorBooks,
        });
      }
      // If only 1 or 0 books, fall through to regular search
    }

    if (searchType === 'book') {
      console.log('Book title search');
      bookData = await searchGoogleBooks(query);
      console.log('Book search result:', bookData ? 'found' : 'not found');
    }

    if (searchType === 'quote') {
      console.log('Quote search detected');
      const bookInfo = await identifyBookFromQuote(query);

      if (bookInfo) {
        console.log('Quote identified as from:', bookInfo);
        bookData = await searchGoogleBooks(`${bookInfo.title} ${bookInfo.author}`);

        if (!bookData) {
          bookData = {
            title: bookInfo.title,
            author: bookInfo.author,
            description: `Quote: "${query}"`,
            imageLinks: undefined,
          };
        }
      }
    }

    const interpretation = await generateInterpretation(query, bookData ?? undefined);

    return NextResponse.json({
      interpretation,
      bookData,
    });
  } catch (error) {
    console.error('Interpret error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
