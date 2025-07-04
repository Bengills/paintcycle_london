import { useState, useEffect } from 'react';
import { supabase, SavedPaint, PaintListing } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useSavedPaints = () => {
  const { user } = useAuth();
  const [savedPaints, setSavedPaints] = useState<(SavedPaint & { paint_listing: PaintListing })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSavedPaints = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_paints')
          .select(`
            *,
            paint_listing:paint_listings(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSavedPaints(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPaints();
  }, [user]);

  return { savedPaints, loading, error };
};