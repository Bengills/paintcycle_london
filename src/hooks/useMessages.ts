import { useState, useEffect } from 'react';
import { supabase, Message } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            paint_listings(*),
            sender:profiles!sender_id(*),
            receiver:profiles!receiver_id(*)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        setMessages(prev => [payload.new as Message, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const sendMessage = async (paintListingId: string, receiverId: string, message: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          paint_listing_id: paintListingId,
          sender_id: user.id,
          receiver_id: receiverId,
          message
        }])
        .select(`
          *,
          paint_listings(*),
          sender:profiles!sender_id(*),
          receiver:profiles!receiver_id(*)
        `)
        .single();

      if (error) throw error;

      // Add new message to state
      setMessages(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(message);
      throw err;
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('receiver_id', user.id);

      if (error) throw error;
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark message as read';
      toast.error(message);
      throw err;
    }
  };

  const replyToMessage = async (originalMessage: Message, replyText: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      // Send reply to the original sender
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          paint_listing_id: originalMessage.paint_listing_id,
          sender_id: user.id,
          receiver_id: originalMessage.sender_id,
          message: replyText
        }])
        .select(`
          *,
          paint_listings(*),
          sender:profiles!sender_id(*),
          receiver:profiles!receiver_id(*)
        `)
        .single();

      if (error) throw error;

      // Add new message to state
      setMessages(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reply';
      toast.error(message);
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    replyToMessage
  };
};