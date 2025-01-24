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
      const { data: currentSession } = await supabase.auth.getSession();
      
      // Se não houver sessão, apenas limpe o estado e redirecione
      if (!currentSession.session) {
        localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
        onLogout();
        navigate("/login");
        return;
      }

      // Se houver sessão, tente fazer logout normalmente
      const { error } = await supabase.auth.signOut();
      
      // Se houver erro de sessão não encontrada, force a limpeza
      if (error && (error.message.includes('session_not_found') || error.message.includes('Session from session_id'))) {
        localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
        onLogout();
        navigate("/login");
        return;
      }

      // Se houver outro tipo de erro, lance-o
      if (error) throw error;

      // Logout bem sucedido
      onLogout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });
      navigate("/login");
      
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      
      // Em caso de erro, force a limpeza do estado
      localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
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