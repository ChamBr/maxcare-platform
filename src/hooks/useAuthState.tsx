
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
    console.log("Limpando estado do usuário");
    setSession(null);
    saveSessionToCookie(null);
    setIsLoading(false);
    setRetryCount(0);
  }, [setSession, setRetryCount, saveSessionToCookie]);

  const refreshSession = useCallback(async (retryAttempt = 0) => {
    if (!isOnline) {
      console.log("Offline: usando sessão em cache");
      const cachedSession = getSessionFromCookie();
      if (cachedSession) {
        setSession(cachedSession);
        await checkUserRole(cachedSession.user.id);
      }
      setIsLoading(false);
      return;
    }

    try {
      console.log(`Atualizando sessão... (tentativa ${retryAttempt + 1})`);
      
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro ao obter sessão:", error);
        throw error;
      }

      if (!currentSession) {
        console.log("Nenhuma sessão encontrada");
        const cachedSession = getSessionFromCookie();
        if (cachedSession) {
          console.log("Usando sessão em cache");
          setSession(cachedSession);
          await checkUserRole(cachedSession.user.id);
        } else {
          clearUserState();
        }
        return;
      }

      console.log("Sessão atualizada com sucesso");
      setSession(currentSession);
      saveSessionToCookie(currentSession);
      await checkUserRole(currentSession.user.id);
      setRetryCount(0);

    } catch (error) {
      console.error("Erro ao atualizar sessão:", error);
      const cachedSession = getSessionFromCookie();
      
      if (cachedSession && shouldRetry(retryCount)) {
        console.log("Usando sessão em cache durante recuperação");
        setSession(cachedSession);
        await checkUserRole(cachedSession.user.id);
      } else if (shouldRetry(retryCount)) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => refreshSession(retryCount + 1), getRetryDelay(retryCount));
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
    getSessionFromCookie,
    saveSessionToCookie,
    shouldRetry,
    getRetryDelay,
    retryCount,
    setRetryCount,
    setSession,
    toast,
    isOnline
  ]);

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (event: any, newSession: any) => {
      if (!mounted) return;

      console.log("Estado de autenticação alterado:", event);

      if (event === 'SIGNED_OUT') {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    refreshSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkUserRole, clearUserState, refreshSession, saveSessionToCookie, setSession]);

  return { isStaff, session, userRole, isLoading, isOnline, clearUserState };
};
