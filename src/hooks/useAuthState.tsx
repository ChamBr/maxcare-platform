
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthState = () => {
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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          if (session?.user) {
            await checkUserRole(session.user.id);
          } else {
            clearUserState();
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        if (mounted) clearUserState();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      setSession(session);
      if (session?.user) {
        await checkUserRole(session.user.id);
      } else {
        clearUserState();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isStaff, session, userRole, isLoading, clearUserState };
};
