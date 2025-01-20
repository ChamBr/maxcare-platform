import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

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