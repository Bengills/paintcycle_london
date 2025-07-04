import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'paint-share@1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Types for database tables
export type Profile = {
  id: string;
  name: string;
  postcode?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type PaintListing = {
  id: string;
  user_id: string;
  brand: string;
  colour: string;
  colour_hex: string;
  amount: string;
  date_opened: string;
  purchase_location?: string;
  postcode: string;
  condition: string;
  notes?: string;
  status: 'active' | 'pending' | 'collected' | 'deleted';
  image_url?: string;
  views: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
};

export type Message = {
  id: string;
  paint_listing_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  created_at: string;
  paint_listings?: PaintListing;
  sender?: Profile;
  receiver?: Profile;
};

export type SavedPaint = {
  id: string;
  user_id: string;
  paint_listing_id: string;
  created_at: string;
  paint_listing?: PaintListing;
};