import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useImpactStats = () => {
  const [totalLitres, setTotalLitres] = useState<number>(0);
  const [donatedPaints, setDonatedPaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        // Get all active and collected paints
        const { data: paintListings, error } = await supabase
          .from('paint_listings')
          .select('amount, status')
          .in('status', ['active', 'collected']);

        if (error) throw error;

        // Calculate total litres from paint listings
        const total = paintListings.reduce((acc, paint) => {
          // Extract number from amount string (e.g., "2.5L" -> 2.5)
          const litres = parseFloat(paint.amount.replace(/[^0-9.]/g, ''));
          
          // Handle "Less than 1L" and "More than 5L" cases
          if (paint.amount === 'Less than 1L') return acc + 0.5;
          if (paint.amount === 'More than 5L') return acc + 7.5;
          
          return acc + (isNaN(litres) ? 0 : litres);
        }, 0);

        // Get donated paints with profiles
        const { data: donatedPaintsData, error: donatedError } = await supabase
          .from('paint_listings')
          .select(`
            *,
            profiles:user_id (
              name,
              postcode
            )
          `)
          .eq('status', 'collected')
          .order('created_at', { ascending: false });

        if (donatedError) throw donatedError;

        setTotalLitres(total);
        setDonatedPaints(donatedPaintsData || []);
      } catch (err) {
        console.error('Error fetching impact stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactStats();

    // Subscribe to changes in paint_listings table
    const subscription = supabase
      .channel('paint_listings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'paint_listings',
      }, () => {
        // Refetch stats when changes occur
        fetchImpactStats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { totalLitres, donatedPaints, loading };
};