import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert snake_case to camelCase for frontend
    const worlds = data?.map((world: any) => ({
      id: world.id,
      userId: world.user_id,
      bookTitle: world.book_title,
      author: world.author,
      bookCover: world.book_cover,
      interpretation: world.interpretation,
      createdAt: world.created_at,
    }));

    return NextResponse.json({ worlds });
  } catch (error) {
    console.error('Get worlds error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch worlds' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('[API] Auth header present:', !!authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client WITH the auth token for RLS
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    console.log('[API] User authenticated:', user?.id);
    console.log('[API] Auth error:', authError);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookTitle, author, bookCover, interpretation } = await request.json();

    console.log('[API] Attempting insert for user:', user.id);

    // Convert camelCase to snake_case for database
    const { data, error } = await supabase
      .from('worlds')
      .insert({
        user_id: user.id,
        book_title: bookTitle,
        author: author,
        book_cover: bookCover,
        interpretation: interpretation,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('[API] Insert error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log('[API] Successfully inserted world:', data?.[0]?.id);

    // Convert back to camelCase for response
    const world = data[0];
    return NextResponse.json({ 
      world: {
        id: world.id,
        userId: world.user_id,
        bookTitle: world.book_title,
        author: world.author,
        bookCover: world.book_cover,
        interpretation: world.interpretation,
        createdAt: world.created_at,
      }
    });
  } catch (error) {
    console.error('Create world error:', error);
    return NextResponse.json(
      { error: 'Failed to save world' },
      { status: 500 }
    );
  }
}
