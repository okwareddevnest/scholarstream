import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  signUp: async (email, password, role, firstName, lastName) => {
    try {
      set({ isLoading: true, error: null });
      
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Create user profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            role,
            first_name: firstName,
            last_name: lastName,
            email,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
        
        // Set the user data directly since getUser might fail immediately after signup
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            role,
            firstName,
            lastName,
            createdAt: data.user.created_at!,
          }
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
      console.error('Sign up error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      await get().getUser();
    } catch (error) {
      set({ error: (error as Error).message });
      console.error('Sign in error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
      console.error('Sign out error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getUser: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get user from Supabase Auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        set({ user: null });
        return;
      }
      
      // Get user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (profileError) {
        // If profile doesn't exist yet but we have auth user data, try to use metadata
        if (authUser.user_metadata) {
          set({
            user: {
              id: authUser.id,
              email: authUser.email!,
              role: (authUser.user_metadata.role as UserRole) || 'student',
              firstName: authUser.user_metadata.first_name || '',
              lastName: authUser.user_metadata.last_name || '',
              createdAt: authUser.created_at!,
            },
          });
          return;
        }
        
        throw profileError;
      }
      
      if (profileData) {
        set({
          user: {
            id: authUser.id,
            email: authUser.email!,
            role: profileData.role,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            createdAt: authUser.created_at!,
          },
        });
      }
    } catch (error) {
      console.error('Get user error:', error);
      // Don't set error state here to avoid login loops
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));