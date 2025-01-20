import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Solicitar Serviço</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Novo Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Em breve você poderá solicitar serviços para suas garantias ativas aqui.
            </p>
            <Button disabled>Solicitar Serviço</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Services;