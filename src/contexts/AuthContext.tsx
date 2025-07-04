import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Exponential backoff retry configuration
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T,>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (
      retries > 0 &&
      error instanceof Error &&
      error.message.includes('Request rate limit reached')
    ) {
      await sleep(delay);
      return retryWithBackoff(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await retryWithBackoff(() => 
          supabase.auth.getSession()
        );
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          try {
            const { data: { session: refreshedSession }, error: refreshError } = 
              await retryWithBackoff(() => supabase.auth.refreshSession());

            if (refreshError) {
              if (refreshError.message.includes('JWT expired')) {
                await supabase.auth.signOut();
                setUser(null);
                navigate('/login');
              }
              throw refreshError;
            }

            setUser(refreshedSession?.user ?? null);
          } catch (refreshError) {
            console.error('Session refresh error:', refreshError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please check your email to confirm your account',
      'User already registered': 'An account with this email already exists',
      'Password is too short': 'Password must be at least 6 characters long',
      'JWT expired': 'Your session has expired. Please sign in again',
      'Request rate limit reached': 'Too many attempts. Please try again in a moment',
    };

    const message = errorMessages[error.message] || 'An error occurred. Please try again';
    toast.error(message);
    
    if (error.message === 'JWT expired') {
      signOut();
    }
    
    throw new Error(message);
  };

  const ensureUserProfile = async (userId: string, name?: string): Promise<boolean> => {
    try {
      const { data: profile, error: profileError } = await retryWithBackoff(() =>
        supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle()
      );

      if (profileError) throw profileError;

      if (!profile) {
        const { error: createError } = await retryWithBackoff(() =>
          supabase
            .from('profiles')
            .insert([{
              id: userId,
              name: name || 'User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
        );

        if (createError) throw createError;
      }

      return true;
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data: { user: newUser }, error } = await retryWithBackoff(() =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        })
      );

      if (error) throw error;
      if (!newUser) throw new Error('User not created');

      const profileCreated = await ensureUserProfile(newUser.id, name);
      if (!profileCreated) {
        await supabase.auth.admin.deleteUser(newUser.id);
        throw new Error('Failed to create user profile');
      }

      toast.success('Account created successfully! Please check your email to confirm your account.');
    } catch (error) {
      if (error instanceof AuthError) {
        handleAuthError(error);
      } else {
        throw error;
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { user: signedInUser }, error } = await retryWithBackoff(() =>
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      );

      if (error) throw error;
      if (!signedInUser) throw new Error('Login failed');

      const profileCreated = await ensureUserProfile(signedInUser.id);
      if (!profileCreated) {
        await supabase.auth.signOut();
        throw new Error('Failed to retrieve or create user profile');
      }

      toast.success('Welcome back!');
    } catch (error) {
      if (error instanceof AuthError) {
        handleAuthError(error);
      } else {
        throw error;
      }
    }
  };

  const signOut = async () => {
    try {
      const { error } = await retryWithBackoff(() => supabase.auth.signOut());
      if (error) throw error;
      setUser(null);
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      if (error instanceof AuthError) {
        handleAuthError(error);
      } else {
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};