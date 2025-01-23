import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bem-vindo ao MaxCare
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gerencie suas garantias e serviços em um só lugar
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="text-lg"
              >
                Começar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="text-lg"
              >
                Fazer Login
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Gestão de Garantias</h3>
              <p className="text-gray-600">
                Registre e acompanhe todas as suas garantias em um só lugar.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Agendamento de Serviços</h3>
              <p className="text-gray-600">
                Agende serviços e manutenções com facilidade.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Notificações</h3>
              <p className="text-gray-600">
                Receba alertas sobre vencimentos e agendamentos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}