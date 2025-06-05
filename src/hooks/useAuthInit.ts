
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export const useAuthInit = () => {
  const { 
    setUser, 
    setSession, 
    fetchProfile, 
    isLoading
  } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        useAuthStore.setState({ isLoading: false });
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          useAuthStore.setState({ isLoading: false });
          return;
        }

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        useAuthStore.setState({ isLoading: false });
      } catch (error) {
        console.error('Auth initialization error:', error);
        useAuthStore.setState({ isLoading: false });
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, fetchProfile]);

  return { isLoading };
};
