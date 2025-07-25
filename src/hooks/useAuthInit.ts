
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
    let initializationComplete = false;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout to prevent potential deadlock
            setTimeout(() => {
              if (mounted) {
                fetchProfile(session.user.id).catch(error => {
                  console.error('Error fetching profile in auth state change:', error);
                });
              }
            }, 0);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        } finally {
          if (mounted && !initializationComplete) {
            initializationComplete = true;
            useAuthStore.setState({ isLoading: false });
          }
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('Starting auth initialization...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
            useAuthStore.setState({ isLoading: false });
          }
          return;
        }

        if (!mounted) return;

        console.log('Initial session check:', session?.user?.email || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to prevent potential auth deadlock
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id).catch(error => {
                console.error('Error fetching profile during initialization:', error);
              });
            }
          }, 0);
        }
        
        if (!initializationComplete) {
          initializationComplete = true;
          useAuthStore.setState({ isLoading: false });
        }
        
        console.log('Auth initialization completed');
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          useAuthStore.setState({ isLoading: false });
        }
      }
    };

    // Add timeout fallback to ensure loading never gets stuck
    const timeoutId = setTimeout(() => {
      if (mounted && !initializationComplete) {
        console.warn('Auth initialization timeout - forcing completion');
        initializationComplete = true;
        useAuthStore.setState({ isLoading: false });
      }
    }, 5000); // 5 second timeout

    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [setUser, setSession, fetchProfile]);

  return { isLoading };
};
