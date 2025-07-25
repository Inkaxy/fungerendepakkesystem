
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export const useAuthInit = () => {
  const { 
    setUser, 
    setSession, 
    fetchProfile, 
    isLoading,
    session: storedSession
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

    // Validate stored session and refresh if needed
    const validateAndRefreshSession = async () => {
      if (storedSession?.expires_at) {
        const expiresAt = new Date(storedSession.expires_at * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        
        // If session expired, try to refresh
        if (timeUntilExpiry <= 0) {
          console.log('Stored session expired, attempting refresh...');
          const { data, error } = await supabase.auth.refreshSession();
          if (error || !data.session) {
            console.log('Session refresh failed, clearing stored auth data');
            setSession(null);
            setUser(null);
            return null;
          }
          return data.session;
        }
        
        // If session expires soon, refresh preemptively
        if (timeUntilExpiry < 10 * 60 * 1000) { // 10 minutes
          console.log('Session expires soon, refreshing preemptively...');
          supabase.auth.refreshSession();
        }
      }
      return storedSession;
    };

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('Starting auth initialization...');
        
        // First validate stored session
        const validStoredSession = await validateAndRefreshSession();
        
        // Then get current session from Supabase
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

        // Use the most recent valid session
        const currentSession = session || validStoredSession;
        
        console.log('Initial session check:', currentSession?.user?.email || 'No session');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent potential auth deadlock
          setTimeout(() => {
            if (mounted) {
              fetchProfile(currentSession.user.id).catch(error => {
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
