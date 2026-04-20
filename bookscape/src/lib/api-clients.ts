import type { Interpretation, GoogleBooksResult } from './types';
import { INTERPRETATION_PROMPT } from './constants';

export async function getBookInfoAI(query: string): Promise<GoogleBooksResult | null> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your-groq-key-here') {
    return null;
  }

  const prompt = `Find information about the book "${query}". If you know this book, respond with ONLY a JSON object in this format:
{"title": "Full Book Title", "author": "Author Name", "description": "Brief description"}

If you don't know this book, respond with null.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content || content === 'null') return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const bookInfo = JSON.parse(jsonMatch[0]);
    return {
      title: bookInfo.title,
      author: bookInfo.author,
      description: bookInfo.description || '',
      imageLinks: undefined,
    };
  } catch (e) {
    console.warn('AI book search failed:', e);
    return null;
  }
}

export async function searchGoogleBooks(query: string): Promise<GoogleBooksResult | null> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || !data.items || data.items.length === 0) {
      console.log('Google Books failed, using AI fallback for book search');
      return await getBookInfoAI(query);
    }

    const book = data.items[0].volumeInfo;
    return {
      title: book.title,
      author: book.authors?.[0] || 'Unknown',
      description: book.description || '',
      imageLinks: book.imageLinks,
    };
  } catch (e) {
    console.warn('Google Books API failed, using AI fallback:', e);
    return await getBookInfoAI(query);
  }
}

export async function getBooksByAuthorAI(author: string): Promise<GoogleBooksResult[]> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your-groq-key-here') {
    throw new Error('GROQ_API_KEY is not set');
  }

  const prompt = `List 10 popular books by ${author}. Respond with ONLY a JSON array in this format:
[{"title": "Book Title", "description": "Brief description"}]

No other text, just the JSON array.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) return [];

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const books = JSON.parse(jsonMatch[0]);

    return books.map((book: any) => ({
      title: book.title,
      author: author,
      description: book.description || '',
      imageLinks: undefined,
    }));
  } catch (e) {
    console.warn('AI author search failed:', e);
    return [];
  }
}

export async function searchBooksByAuthor(author: string): Promise<GoogleBooksResult[]> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(author)}&maxResults=12`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || !data.items || data.items.length === 0) {
      console.log('Google Books failed, using AI fallback');
      return await getBooksByAuthorAI(author);
    }

    return data.items.map((item: any) => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown',
      description: item.volumeInfo.description || '',
      imageLinks: item.volumeInfo.imageLinks,
    }));
  } catch (e) {
    console.warn('Google Books author search failed, using AI fallback:', e);
    return await getBooksByAuthorAI(author);
  }
}

export async function detectSearchType(query: string): Promise<'book' | 'author' | 'quote'> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your-groq-key-here') {
    return 'book';
  }

  const prompt = `Classify this search query as either "book" (book title), "author" (author name), or "quote" (a quote from a book).

Respond with ONLY one word: book, author, or quote.

Query: "${query}"`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0.1,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim().toLowerCase();

    if (content === 'author') return 'author';
    if (content === 'quote') return 'quote';
    return 'book';
  } catch (e) {
    console.warn('Search type detection failed:', e);
    return 'book';
  }
}

export async function identifyBookFromQuote(quote: string): Promise<{ title: string; author: string } | null> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your-groq-key-here') {
    throw new Error('GROQ_API_KEY is not set');
  }

  const prompt = `Identify the book and author from this quote. If you recognize it, respond with ONLY a JSON object in this exact format: {"title": "Book Title", "author": "Author Name"}. If you don't recognize the quote, respond with null.

Quote: "${quote}"`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.3,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content || content === 'null') return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.warn('Quote identification failed:', e);
    return null;
  }
}

export async function generateInterpretation(
  input: string,
  bookData?: GoogleBooksResult
): Promise<Interpretation> {
  const userMessage = bookData
    ? `Book: ${bookData.title} by ${bookData.author}\nDescription: ${bookData.description}`
    : `Quote or theme: ${input}`;

  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'your-groq-key-here') {
    throw new Error('GROQ_API_KEY is not set. Please update .env.local');
  }

  const prompt = `${INTERPRETATION_PROMPT}\n\n${userMessage}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  
  if (!res.ok) {
    console.error('Groq API error:', data);
    throw new Error(`Groq API error: ${data.error?.message || JSON.stringify(data)}`);
  }

  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content in Groq response');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]);
}
