import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update all worlds to set book_cover to null
    const { data, error } = await supabase
      .from('worlds')
      .update({ book_cover: null })
      .not('book_cover', 'is', null);

    if (error) {
      console.error('[Cleanup] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to clean up covers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'All book covers cleaned up successfully',
    });
  } catch (error) {
    console.error('[Cleanup] Error:', error);
    return NextResponse.json(
      { error: 'Failed to clean up covers' },
      { status: 500 }
    );
  }
}
