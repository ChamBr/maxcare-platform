import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-md mx-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Bem-vindo ao CareHub
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Gerencie suas garantias e serviços de forma simples e eficiente
        </p>
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/register")}
            className="w-full md:w-auto px-8 py-6 text-lg"
          >
            Começar Agora
          </Button>
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="px-8 py-6 text-lg"
            >
              Já tenho uma conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;