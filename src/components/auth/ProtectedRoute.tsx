import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro ao verificar sessão:", error);
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }

      if (!session) {
        setIsAuthenticated(false);
        toast({
          title: "Autenticação necessária",
          description: "Por favor, faça login para acessar esta página",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let visibilityTimeout: NodeJS.Timeout;

    const handleAuthChange = (event: string, session: any) => {
      if (!mounted) return;

      console.log("Protected route auth state changed:", event, session);

      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        navigate("/login");
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      }
    };

    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Adiciona listener para visibilidade da página
    const handleVisibilityChange = async () => {
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }

      if (!document.hidden) {
        console.log("Page became visible, checking auth...");
        // Pequeno delay para garantir que a conexão foi reestabelecida
        visibilityTimeout = setTimeout(async () => {
          await checkAuth();
        }, 500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);
    window.addEventListener("online", handleVisibilityChange);

    checkAuth();

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
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};