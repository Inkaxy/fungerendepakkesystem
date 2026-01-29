import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';

// Create a query client instance for cache clearing
const queryClient = new QueryClient();

export type UserRole = 'super_admin' | 'bakery_admin' | 'bakery_user';
export type AuthProvider = 'email' | 'google';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bakery_id: string | null;
  bakery_name?: string | null;
  bakery_short_id: string | null;
  provider: AuthProvider;
  email_confirmed: boolean;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  
  // Email/Password Auth
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  
  // Profile Management
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      isAuthenticating: false,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),

      // Email/Password Registration
      signUp: async (email: string, password: string, name?: string) => {
        set({ isAuthenticating: true });
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
            }
          }
        });

        set({ isAuthenticating: false });

        if (error) {
          return { error };
        }

        return { error: null };
      },

      // Email/Password Login
      signIn: async (email: string, password: string) => {
        set({ isAuthenticating: true });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          set({ isAuthenticating: false });
          return { error };
        }

        if (data.user && data.session) {
          set({ 
            user: data.user, 
            session: data.session,
            isAuthenticating: false 
          });
          // Don't call fetchProfile here to avoid auth deadlock
          // It will be called by the auth state change listener
        }

        return { error: null };
      },

      // Sign Out
      signOut: async () => {
        await supabase.auth.signOut();
        
        // Clear all React Query cache to prevent data leakage between users
        queryClient.clear();
        console.log('🧹 Cache cleared on logout');
        
        set({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
        });
      },

      // Fetch User Profile
      fetchProfile: async (userId: string) => {
        try {
          console.log('Fetching profile for user:', userId);
          
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`
              id, email, name, avatar_url, bakery_id, provider, email_confirmed, is_active,
              bakeries(name, short_id)
            `)
            .eq('id', userId)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }

          // Fetch role from user_roles table
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .order('role', { ascending: true }) // super_admin < bakery_admin < bakery_user alphabetically
            .limit(1)
            .maybeSingle();

          if (roleError) {
            console.error('Error fetching user role:', roleError);
            // Fallback to role from profiles table for backward compatibility
          }

          if (profileData) {
            // Type the bakeries relation properly
            const bakeryData = profileData.bakeries as { name: string; short_id: string } | null;
            
            const profile: UserProfile = {
              id: profileData.id,
              email: profileData.email || '',
              name: profileData.name,
              avatar_url: profileData.avatar_url,
              role: (roleData?.role || 'bakery_user') as UserRole, // Use role from user_roles, fallback to bakery_user
              bakery_id: profileData.bakery_id,
              bakery_name: bakeryData?.name || null,
              bakery_short_id: bakeryData?.short_id || null,
              provider: profileData.provider as AuthProvider,
              email_confirmed: profileData.email_confirmed,
              is_active: profileData.is_active,
            };
            set({ profile });
            
            console.log('Profile fetched successfully:', profile.email, profile.role, 'bakery_short_id:', profile.bakery_short_id);
            
            // Log last login
            await supabase
              .from('profiles')
              .update({ last_login: new Date().toISOString() })
              .eq('id', userId)
              .select()
              .maybeSingle();
          } else {
            console.log('No profile found for user:', userId);
            set({ profile: null });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Don't set profile to null, keep existing state
        }
      },

      // Update Profile
      updateProfile: async (updates: Partial<UserProfile>) => {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', get().user?.id);

          if (error) throw error;

          // Update local state
          set(state => ({
            profile: state.profile ? { ...state.profile, ...updates } : null
          }));

          return { error: null };
        } catch (error) {
          return { error };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
    }
  )
);
