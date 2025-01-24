import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Primeiro limpa o token local para garantir
      localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
      
      // Tenta fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      // Se houver erro de sessão não encontrada, apenas ignore
      if (error && error.message.includes('session_not_found')) {
        onLogout();
        navigate("/login");
        return;
      }

      // Se houver outro tipo de erro, registre mas não impeça o logout
      if (error) {
        console.error("Erro ao fazer logout no Supabase:", error);
      }

      // Sempre limpa o estado e redireciona
      onLogout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });
      navigate("/login");
      
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      
      // Mesmo com erro, garante que o usuário seja desconectado localmente
      onLogout();
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar, mas você foi desconectado localmente.",
      });
      navigate("/login");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
};