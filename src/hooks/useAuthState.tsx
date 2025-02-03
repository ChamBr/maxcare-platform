import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthState = () => {
  const { toast } = useToast();
  const [isStaff, setIsStaff] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("customer");
  const [isLoading, setIsLoading] = useState(true);

  const clearUserState = () => {
    setIsStaff(false);
    setUserRole("customer");
    setSession(null);
    setIsLoading(false);
  };

  const checkUserRole = async (userId: string) => {
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
  };

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Erro ao obter sessão:", sessionError);
        clearUserState();
        return;
      }

      if (!currentSession) {
        clearUserState();
        return;
      }

      setSession(currentSession);
      await checkUserRole(currentSession.user.id);
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
      clearUserState();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let visibilityTimeout: NodeJS.Timeout;

    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.log("Auth state changed:", event, newSession);

      if (event === 'SIGNED_OUT' || !newSession) {
        clearUserState();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(newSession);
        setIsLoading(true);
        await checkUserRole(newSession.user.id);
        setIsLoading(false);
      }
    });

    // Adiciona listener para visibilidade da página
    const handleVisibilityChange = async () => {
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }

      if (!document.hidden) {
        console.log("Page became visible, checking session...");
        // Pequeno delay para garantir que a conexão foi reestabelecida
        visibilityTimeout = setTimeout(async () => {
          await initializeAuth();
        }, 500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
    window.addEventListener("online", handleVisibilityChange);

    // Inicializa o estado de autenticação
    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
      window.removeEventListener("online", handleVisibilityChange);
    };
  }, []);

  return { isStaff, session, userRole, isLoading, clearUserState };
};