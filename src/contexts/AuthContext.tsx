import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'staff' | 'cashier' | 'kitchen';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        // Fallback for demo mode
        const savedUser = localStorage.getItem('gs_demo_user');
        if (savedUser) {
          const demoProfile = JSON.parse(savedUser);
          setProfile(demoProfile);
          setUser({ id: demoProfile.id, email: demoProfile.email } as User);
        }
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Demo mode fallback
      const demoUsers = [
        { id: '1', email: 'admin@gs.com', full_name: 'Admin User', role: 'admin' as UserRole, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', email: 'staff@gs.com', full_name: 'Staff Member', role: 'staff' as UserRole, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ];
      
      const demoUser = demoUsers.find(u => u.email === email);
      if (demoUser && password === 'password') {
        setProfile(demoUser);
        setUser({ id: demoUser.id, email: demoUser.email } as User);
        localStorage.setItem('gs_demo_user', JSON.stringify(demoUser));
        return { error: null };
      }
      return { error: { message: 'Invalid credentials' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      return { error: { message: 'Database not configured' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      // Demo mode
      setUser(null);
      setProfile(null);
      localStorage.removeItem('gs_demo_user');
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!supabase || !user) {
      return { error: { message: 'Not authenticated' } };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};