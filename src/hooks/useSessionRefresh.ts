import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export const useSessionRefresh = () => {
  const { session } = useAuthStore();
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const activityTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!session?.expires_at) return;

    const scheduleRefresh = () => {
      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      // Schedule refresh 5 minutes before expiry, but at least 1 minute from now
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000);
      
      if (refreshTime > 0) {
        console.log(`Scheduling token refresh in ${Math.round(refreshTime / 1000)}s`);
        refreshTimeoutRef.current = setTimeout(async () => {
          console.log('Auto-refreshing session...');
          try {
            const { error } = await supabase.auth.refreshSession();
            if (error) {
              console.error('Auto-refresh failed:', error);
            } else {
              console.log('Session auto-refreshed successfully');
            }
          } catch (error) {
            console.error('Auto-refresh error:', error);
          }
        }, refreshTime);
      }
    };

    scheduleRefresh();

    // Set up activity-based session extension
    const extendSessionOnActivity = () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      
      // Extend session if user is active and session expires in less than 30 minutes
      activityTimeoutRef.current = setTimeout(() => {
        if (session?.expires_at) {
          const expiresAt = new Date(session.expires_at * 1000);
          const now = new Date();
          const timeUntilExpiry = expiresAt.getTime() - now.getTime();
          
          if (timeUntilExpiry < 30 * 60 * 1000) { // 30 minutes
            console.log('Extending session due to user activity');
            supabase.auth.refreshSession();
          }
        }
      }, 60 * 1000); // Check every minute
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => extendSessionOnActivity();
    
    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, activityHandler);
      });
    };
  }, [session?.expires_at]);

  return {
    scheduleRefresh: () => {
      if (session?.expires_at) {
        console.log('Manual session refresh triggered');
        supabase.auth.refreshSession();
      }
    }
  };
};