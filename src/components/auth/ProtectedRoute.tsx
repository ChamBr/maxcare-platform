
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session && mounted) {
          toast({
            title: "Autenticação necessária",
            description: "Por favor, faça login para acessar esta página",
            variant: "destructive",
          });
          navigate("/login", { state: { from: location.pathname } });
          return;
        }
        
        if (mounted) setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        if (mounted) navigate("/login", { state: { from: location.pathname } });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (!session) {
        setIsAuthenticated(false);
        navigate("/login", { state: { from: location.pathname } });
      } else {
        setIsAuthenticated(true);
      }
    });

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location, toast]);

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
};
