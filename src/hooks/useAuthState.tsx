
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthState = () => {
  const { toast } = useToast();
  const [isStaff, setIsStaff] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("customer");
  const [isLoading, setIsLoading] = useState(true);

  const clearUserState = useCallback(() => {
    setIsStaff(false);
    setUserRole("customer");
    setSession(null);
    setIsLoading(false);
  }, []);

  const checkUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar papel do usuário:", error);
        return;
      }

      if (data) {
        setUserRole(data.role);
        setIsStaff(["dev", "admin"].includes(data.role));
      }
    } catch (error) {
      console.error("Erro ao verificar papel do usuário:", error);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    console.log("Refreshing session...");
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Session refresh result:", currentSession ? "Session found" : "No session");
      
      if (!currentSession) {
        clearUserState();
        return;
      }

      setSession(currentSession);
      await checkUserRole(currentSession.user.id);
    } catch (error) {
      console.error("Erro ao atualizar sessão:", error);
      clearUserState();
    } finally {
      setIsLoading(false);
    }
  }, [checkUserRole, clearUserState]);

  useEffect(() => {
    let mounted = true;
    let refreshTimeoutId: NodeJS.Timeout | null = null;

    const handleAuthChange = async (event: any, newSession: any) => {
      if (!mounted) return;

      console.log("Auth state changed:", event);

      if (event === 'SIGNED_OUT' || !newSession) {
        clearUserState();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsLoading(true);
        setSession(newSession);
        await checkUserRole(newSession.user.id);
        setIsLoading(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && mounted) {
        if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
        refreshTimeoutId = setTimeout(refreshSession, 100);
      }
    };

    // Initial session check
    refreshSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Set up visibility listener
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      subscription.unsubscribe();
    };
  }, [checkUserRole, clearUserState, refreshSession]);

  return { isStaff, session, userRole, isLoading, clearUserState };
};
