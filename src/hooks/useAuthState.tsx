
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "./auth/useSession";
import { useUserRole } from "./auth/useUserRole";
import { useAuthRetry } from "./auth/useAuthRetry";
import { useConnectionState } from "./auth/useConnectionState";

export const useAuthState = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { isStaff, userRole, checkUserRole } = useUserRole();
  const { session, setSession, saveSessionToCookie, getSessionFromCookie } = useSession();
  const { retryCount, setRetryCount, shouldRetry, getRetryDelay } = useAuthRetry();
  const { isOnline } = useConnectionState();

  const clearUserState = useCallback(() => {
    setSession(null);
    setIsLoading(false);
    setRetryCount(0);
  }, [setSession, setRetryCount]);

  const refreshSession = useCallback(async (retryAttempt = 0) => {
    if (!isOnline) {
      console.log("Offline - usando sessão do cookie se disponível");
      const cachedSession = getSessionFromCookie();
      if (cachedSession) {
        setSession(cachedSession);
        await checkUserRole(cachedSession.user.id);
        setIsLoading(false);
        return;
      }
      return;
    }

    console.log(`Tentativa ${retryAttempt + 1} de atualizar sessão...`);
    
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro ao obter sessão:", error);
        throw error;
      }

      console.log("Resultado da atualização:", currentSession ? "Sessão encontrada" : "Sem sessão");
      
      if (!currentSession) {
        const cachedSession = getSessionFromCookie();
        if (cachedSession && shouldRetry(retryAttempt)) {
          console.log("Usando sessão em cache enquanto tenta reconectar");
          setSession(cachedSession);
          await checkUserRole(cachedSession.user.id);
          console.log(`Aguardando ${getRetryDelay(retryAttempt)}ms para tentar novamente...`);
          setTimeout(() => refreshSession(retryAttempt + 1), getRetryDelay(retryAttempt));
          return;
        }
        clearUserState();
        return;
      }

      const expiresAt = new Date((currentSession.expires_at || 0) * 1000);
      const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000);

      if (expiresAt < thirtyMinutesFromNow) {
        console.log("Token próximo de expirar, renovando...");
        const { data: { session: refreshedSession }, error: refreshError } = 
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error("Erro ao renovar token:", refreshError);
          throw refreshError;
        }

        if (refreshedSession) {
          setSession(refreshedSession);
          saveSessionToCookie(refreshedSession);
          await checkUserRole(refreshedSession.user.id);
        }
      } else {
        setSession(currentSession);
        saveSessionToCookie(currentSession);
        await checkUserRole(currentSession.user.id);
      }

      setRetryCount(0);
    } catch (error) {
      console.error("Erro ao atualizar sessão:", error);
      setRetryCount(prev => prev + 1);
      
      const cachedSession = getSessionFromCookie();
      if (cachedSession && shouldRetry(retryCount)) {
        console.log("Usando sessão em cache durante erro");
        setSession(cachedSession);
        await checkUserRole(cachedSession.user.id);
      } else if (shouldRetry(retryCount)) {
        console.log(`Tentativa ${retryCount + 1}`);
        setTimeout(() => refreshSession(), getRetryDelay(retryCount));
      } else {
        clearUserState();
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível atualizar sua sessão. Por favor, faça login novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    checkUserRole, 
    clearUserState, 
    isOnline, 
    retryCount, 
    toast, 
    getSessionFromCookie, 
    saveSessionToCookie,
    shouldRetry,
    getRetryDelay,
    setRetryCount,
    setSession
  ]);

  useEffect(() => {
    let mounted = true;
    let refreshTimeoutId: NodeJS.Timeout | null = null;

    const handleAuthChange = async (event: any, newSession: any) => {
      if (!mounted) return;

      console.log("Estado de autenticação alterado:", event);

      if (event === 'SIGNED_OUT' || !newSession) {
        clearUserState();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsLoading(true);
        setSession(newSession);
        saveSessionToCookie(newSession);
        await checkUserRole(newSession.user.id);
        setIsLoading(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && mounted) {
        console.log("Página visível - verificando sessão em cache primeiro");
        const cachedSession = getSessionFromCookie();
        if (cachedSession) {
          setSession(cachedSession);
          checkUserRole(cachedSession.user.id);
        }
        if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
        refreshTimeoutId = setTimeout(() => refreshSession(), 100);
      }
    };

    // Verificação inicial da sessão
    const cachedSession = getSessionFromCookie();
    if (cachedSession) {
      setSession(cachedSession);
      checkUserRole(cachedSession.user.id);
    }
    refreshSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      subscription.unsubscribe();
    };
  }, [checkUserRole, clearUserState, refreshSession, saveSessionToCookie, getSessionFromCookie, setSession]);

  return { isStaff, session, userRole, isLoading, isOnline, clearUserState };
};
