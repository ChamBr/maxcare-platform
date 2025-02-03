
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "maxcare_session";
const SESSION_EXPIRY_HOURS = 1;

export const useAuthState = () => {
  const { toast } = useToast();
  const [isStaff, setIsStaff] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("customer");
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000;

  const clearUserState = useCallback(() => {
    setIsStaff(false);
    setUserRole("customer");
    setSession(null);
    setIsLoading(false);
    setRetryCount(0);
    Cookies.remove(SESSION_COOKIE_NAME);
  }, []);

  const saveSessionToCookie = useCallback((currentSession: any) => {
    if (!currentSession) {
      Cookies.remove(SESSION_COOKIE_NAME);
      return;
    }

    Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(currentSession), {
      expires: SESSION_EXPIRY_HOURS / 24, // Converter horas para dias
      secure: true,
      sameSite: 'strict'
    });
  }, []);

  const getSessionFromCookie = useCallback(() => {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME);
    return sessionCookie ? JSON.parse(sessionCookie) : null;
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
        if (cachedSession && retryAttempt < MAX_RETRY_ATTEMPTS) {
          console.log("Usando sessão em cache enquanto tenta reconectar");
          setSession(cachedSession);
          await checkUserRole(cachedSession.user.id);
          console.log(`Aguardando ${RETRY_DELAY}ms para tentar novamente...`);
          setTimeout(() => refreshSession(retryAttempt + 1), RETRY_DELAY * (retryAttempt + 1));
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
      if (cachedSession && retryCount < MAX_RETRY_ATTEMPTS) {
        console.log("Usando sessão em cache durante erro");
        setSession(cachedSession);
        await checkUserRole(cachedSession.user.id);
      } else if (retryCount < MAX_RETRY_ATTEMPTS) {
        console.log(`Tentativa ${retryCount + 1} de ${MAX_RETRY_ATTEMPTS}`);
        setTimeout(refreshSession, RETRY_DELAY * (retryCount + 1));
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
  }, [checkUserRole, clearUserState, isOnline, retryCount, toast, getSessionFromCookie, saveSessionToCookie]);

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

    const handleOnline = () => {
      console.log("Conexão restaurada - atualizando sessão");
      setIsOnline(true);
      refreshSession();
    };

    const handleOffline = () => {
      console.log("Conexão perdida - usando cache");
      setIsOnline(false);
      const cachedSession = getSessionFromCookie();
      if (cachedSession) {
        setSession(cachedSession);
        checkUserRole(cachedSession.user.id);
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
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      mounted = false;
      if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      subscription.unsubscribe();
    };
  }, [checkUserRole, clearUserState, refreshSession, saveSessionToCookie, getSessionFromCookie]);

  return { isStaff, session, userRole, isLoading, isOnline, clearUserState };
};

