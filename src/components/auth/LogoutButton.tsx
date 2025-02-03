
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log("Iniciando processo de logout");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro ao fazer logout:", error);
        throw error;
      }

      console.log("Logout realizado com sucesso");
      onLogout();
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });
      
      // Redireciona para a página de login com replace para evitar voltar ao estado anterior
      navigate("/login", { replace: true });
      
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro inesperado ao tentar desconectar.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      disabled={isLoading}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
};
