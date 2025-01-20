import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-primary mb-6">
          Proteção e tranquilidade para seus investimentos
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Gerencie suas garantias estendidas, solicite serviços e mantenha seus produtos protegidos com a MaxCare.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="bg-primary hover:bg-primary-700"
          >
            Começar Agora
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/services")}
          >
            Solicitar Serviço
          </Button>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Garantia Estendida</h3>
            <p className="text-gray-600">
              Proteção adicional para seus produtos com cobertura completa.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Serviços Especializados</h3>
            <p className="text-gray-600">
              Atendimento técnico qualificado para manutenção e reparos.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-2">Gestão Simplificada</h3>
            <p className="text-gray-600">
              Acompanhe suas garantias e solicite serviços em poucos cliques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;