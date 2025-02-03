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

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          if (mounted) {
            setIsAuthenticated(false);
            navigate("/login");
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            toast({
              title: "Autenticação necessária",
              description: "Por favor, faça login para acessar esta página",
              variant: "destructive",
            });
            navigate("/login");
          }
          return;
        }
        
        if (mounted) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        if (mounted) {
          setIsAuthenticated(false);
          navigate("/login");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Configura o listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log("Protected route auth state changed:", event, session);

      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        navigate("/login");
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      }
    });

    // Adiciona listener para visibilidade da página
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log("Page became visible, checking auth...");
        await checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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