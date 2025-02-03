
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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Tenta recuperar a sessão atual
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError);
          if (mounted) clearUserState();
          return;
        }

        if (!currentSession) {
          if (mounted) clearUserState();
          return;
        }

        if (mounted) {
          setSession(currentSession);
          await checkUserRole(currentSession.user.id);
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        if (mounted) clearUserState();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Inicializa o estado de autenticação
    initializeAuth();

    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, newSession);
      
      if (!mounted) return;

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

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isStaff, session, userRole, isLoading, clearUserState };
};
