import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function getServerSession() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Get auth token from cookies
  const authCookie = allCookies.find(cookie => 
    cookie.name.includes('sb-') && cookie.name.includes('auth-token')
  );
  
  if (!authCookie) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
