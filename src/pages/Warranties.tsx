import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Warranties = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Minhas Garantias</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Garantia #12345</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Em breve você poderá visualizar suas garantias ativas aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Warranties;