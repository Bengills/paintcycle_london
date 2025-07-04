import { useState } from 'react';
import { supabase, PaintListing } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const usePaintListingActions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaintListing = async (listing: Omit<PaintListing, 'id' | 'user_id' | 'views' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Please sign in to list paint');
      throw new Error('No user logged in');
    }
    
    setLoading(true);
    setError(null);

    try {
      // First, ensure the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If no profile exists, create one
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            name: user.user_metadata.name || 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (createProfileError) {
          throw new Error('Failed to create user profile');
        }
      }

      // Now create the paint listing
      const { data, error } = await supabase
        .from('paint_listings')
        .insert([{ 
          ...listing,
          user_id: user.id,
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create paint listing';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePaintListing = async (id: string, updates: Partial<PaintListing>) => {
    if (!user) {
      toast.error('Please sign in to update paint listing');
      throw new Error('No user logged in');
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('paint_listings')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update paint listing';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const markAsDonated = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to update paint listing');
      throw new Error('No user logged in');
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('paint_listings')
        .update({ 
          status: 'collected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Paint marked as donated');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark paint as donated';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const relistPaint = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to re-list paint');
      throw new Error('No user logged in');
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('paint_listings')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Paint re-listed successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to re-list paint';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePaintListing = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to delete paint listing');
      throw new Error('No user logged in');
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('paint_listings')
        .update({ status: 'deleted' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete paint listing';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSavedPaint = async (paintListingId: string) => {
    if (!user) {
      toast.error('Please sign in to save paint');
      throw new Error('No user logged in');
    }
    
    setLoading(true);
    setError(null);

    try {
      // Check if already saved
      const { data: existing, error: checkError } = await supabase
        .from('saved_paints')
        .select('id')
        .eq('user_id', user.id)
        .eq('paint_listing_id', paintListingId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existing) {
        // Unsave
        const { error } = await supabase
          .from('saved_paints')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;
        toast.success('Paint removed from saved items');
        return false; // Not saved anymore
      } else {
        // Save
        const { error } = await supabase
          .from('saved_paints')
          .insert([{ user_id: user.id, paint_listing_id: paintListingId }]);

        if (error) throw error;
        toast.success('Paint saved successfully');
        return true; // Now saved
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle saved status';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaintListing,
    updatePaintListing,
    deletePaintListing,
    toggleSavedPaint,
    markAsDonated,
    relistPaint,
    loading,
    error
  };
};