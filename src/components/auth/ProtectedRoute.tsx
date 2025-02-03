
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from "@/hooks/useAuthState";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading } = useAuthState();

  useEffect(() => {
    // Se não houver sessão após carregar, redireciona para o login
    if (!isLoading && !session) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [session, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return session ? <>{children}</> : null;
};
