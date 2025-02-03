
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from "@/hooks/useAuthState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading, isOnline } = useAuthState();

  useEffect(() => {
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

  if (!isOnline) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Você está offline. Algumas funcionalidades podem não estar disponíveis.
        </AlertDescription>
      </Alert>
    );
  }

  return session ? <>{children}</> : null;
};
