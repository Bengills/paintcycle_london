import { useEffect, useState, useCallback } from 'react';
import { supabase, PaintListing } from '../lib/supabase';
import { usePostcodeDistance } from './usePostcodeDistance';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T,>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      if (
        error instanceof Error && (
          error.message.includes('Failed to fetch') ||
          error.message.includes('Network request failed') ||
          error.message.includes('Request rate limit reached') ||
          error.message.includes('Auth session missing') ||
          error.message.includes('JWT expired') ||
          error.message.includes('network error')
        )
      ) {
        console.warn(`Retrying operation, attempts remaining: ${retries - 1}`);
        await sleep(delay);
        return retryWithBackoff(operation, retries - 1, delay * 2);
      }
    }
    throw error;
  }
};

export interface ExtendedPaintListing extends PaintListing {
  distance?: number | null;
}

export const usePaintListings = (userOnly: boolean = false) => {
  const [paintListings, setPaintListings] = useState<ExtendedPaintListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { calculateDistance } = usePostcodeDistance();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPaintListings = useCallback(async () => {
    try {
      // Check for authentication if viewing user-specific listings
      if (userOnly && !user) {
        navigate('/login');
        return;
      }

      // Get current session and refresh if needed
      const { data: { session }, error: sessionError } = await retryWithBackoff(() => 
        supabase.auth.getSession()
      );

      if (sessionError) {
        if (sessionError.message.includes('JWT expired')) {
          // Try to refresh the session
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            navigate('/login');
            return;
          }
        } else {
          throw sessionError;
        }
      }

      if (!session && userOnly) {
        navigate('/login');
        return;
      }

      // Verify Supabase connection with the refreshed session
      const { error: healthCheckError } = await retryWithBackoff(() => 
        supabase.from('paint_listings').select('id').limit(1)
      );

      if (healthCheckError) {
        if (healthCheckError.message.includes('JWT expired')) {
          navigate('/login');
          return;
        }
        throw new Error('Unable to connect to database. Please check your connection.');
      }

      let query = supabase
        .from('paint_listings')
        .select('*, profiles(*)');

      if (userOnly) {
        // For user's own listings, show both active and collected
        query = query
          .eq('user_id', user.id)
          .in('status', ['active', 'collected']);
      } else {
        // For public listings, only show active ones
        query = query.eq('status', 'active');
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: fetchError } = await retryWithBackoff(() => query);

      if (fetchError) {
        throw fetchError;
      }

      // Process listings sequentially to avoid rate limits
      const listingsWithDistance = [];
      for (const listing of data || []) {
        try {
          const distance = await retryWithBackoff(() => calculateDistance(listing.postcode));
          listingsWithDistance.push({ ...listing, distance });
        } catch (distanceError) {
          console.error('Error calculating distance for listing:', distanceError);
          listingsWithDistance.push({ ...listing, distance: null });
        }
      }

      setPaintListings(listingsWithDistance);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error fetching paint listings:', err);
      
      if (message.includes('JWT expired') || message.includes('Auth session missing')) {
        toast.error('Your session has expired. Please sign in again.');
        navigate('/login');
      } else if (message.includes('Request rate limit reached')) {
        toast.error('Too many requests. Please try again in a moment.');
      } else if (message.includes('Failed to fetch') || message.includes('network error')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else if (message.includes('Unable to connect to database')) {
        toast.error('Unable to connect to the database. Please try again later.');
      } else {
        toast.error('Failed to load paint listings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [calculateDistance, user, userOnly, navigate]);

  useEffect(() => {
    fetchPaintListings();

    // Set up real-time subscription only if we have a valid user session for user-specific listings
    if (!userOnly || (userOnly && user)) {
      const subscription = supabase
        .channel('paint_listings_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'paint_listings',
        }, () => {
          fetchPaintListings();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [fetchPaintListings, user, userOnly]);

  return { paintListings, loading, error };
};