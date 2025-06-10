import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientComponentClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client
export const createServerComponentClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Default client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
