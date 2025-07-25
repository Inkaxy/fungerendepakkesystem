import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const SessionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, setSession, setUser } = useAuthStore();

  useEffect(() => {
    // Global error handler for authentication errors
    const handleAuthError = (error: any) => {
      if (error?.message?.includes('JWT expired') || 
          error?.message?.includes('refresh_token_not_found') ||
          error?.status === 401) {
        console.log('Authentication error detected, attempting recovery...');
        
        // Try to refresh the session
        supabase.auth.refreshSession().then(({ data, error: refreshError }) => {
          if (refreshError || !data.session) {
            console.log('Session refresh failed, clearing auth state');
            setSession(null);
            setUser(null);
            toast.error('Din innlogging har utløpt. Vennligst logg inn på nytt.');
          } else {
            console.log('Session refreshed successfully');
            toast.success('Innloggingen ble fornyet automatisk');
          }
        });
      }
    };

    // Listen for auth state changes and handle session refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change in SessionManager:', event);
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
          setSession(session);
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setSession(null);
          setUser(null);
        }
      }
    );

    // Set up global error interceptor for Supabase requests
    const originalFrom = supabase.from;
    supabase.from = function(relation: string) {
      const table = originalFrom.call(this, relation);
      const originalSelect = table.select;
      const originalInsert = table.insert;
      const originalUpdate = table.update;
      const originalDelete = table.delete;

      // Wrap select with error handling
      table.select = function(...args: any[]) {
        return originalSelect.apply(this, args).then(
          (result) => result,
          (error) => {
            handleAuthError(error);
            throw error;
          }
        );
      };

      // Wrap other operations similarly
      table.insert = function(...args: any[]) {
        return originalInsert.apply(this, args).then(
          (result) => result,
          (error) => {
            handleAuthError(error);
            throw error;
          }
        );
      };

      table.update = function(...args: any[]) {
        return originalUpdate.apply(this, args).then(
          (result) => result,
          (error) => {
            handleAuthError(error);
            throw error;
          }
        );
      };

      table.delete = function(...args: any[]) {
        return originalDelete.apply(this, args).then(
          (result) => result,
          (error) => {
            handleAuthError(error);
            throw error;
          }
        );
      };

      return table;
    };

    return () => {
      subscription.unsubscribe();
      // Restore original supabase.from
      supabase.from = originalFrom;
    };
  }, [setSession, setUser]);

  return <>{children}</>;
};