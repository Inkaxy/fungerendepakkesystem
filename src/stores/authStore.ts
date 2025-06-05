
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError, Provider } from '@supabase/supabase-js';

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
          await get().fetchProfile(data.user.id);
        }

        return { error: null };
      },

      // Sign Out
      signOut: async () => {
        await supabase.auth.signOut();
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
          const { data, error } = await supabase
            .from('profiles')
            .select(`
              id, email, name, avatar_url, role, bakery_id, provider, email_confirmed, is_active,
              bakeries(name)
            `)
            .eq('id', userId)
            .single();

          if (error) throw error;

          if (data) {
            const profile: UserProfile = {
              id: data.id,
              email: data.email || '',
              name: data.name,
              avatar_url: data.avatar_url,
              role: data.role as UserRole,
              bakery_id: data.bakery_id,
              bakery_name: data.bakeries?.name || null,
              provider: data.provider as AuthProvider,
              email_confirmed: data.email_confirmed,
              is_active: data.is_active,
            };
            set({ profile });
            
            // Log last login
            await supabase
              .from('profiles')
              .update({ last_login: new Date().toISOString() })
              .eq('id', userId);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
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
        user: null,
        session: null,
        profile: state.profile,
      }),
    }
  )
);
