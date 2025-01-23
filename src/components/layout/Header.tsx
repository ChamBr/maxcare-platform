import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setIsAdmin(roles?.role === "dev");
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-primary cursor-pointer"
          >
            MaxCare
          </h1>
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost"
              onClick={() => navigate("/warranties")}
            >
              Minhas Garantias
            </Button>
            <Button 
              variant="ghost"
              onClick={() => navigate("/services")}
            >
              Solicitar Serviço
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost"
                onClick={() => navigate("/admin")}
              >
                Admin
              </Button>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>
          <Button 
            onClick={() => navigate("/register")}
          >
            Cadastrar
          </Button>
        </div>
      </div>
    </header>
  );
};