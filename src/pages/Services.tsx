import { useQuery } from "@tanstack/react-query";
import { Clock, Plus, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isAfter, parseISO } from "date-fns";

const Services = () => {
  const { toast } = useToast();

  const { data: warranties } = useQuery({
    queryKey: ["active-warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          *,
          warranty_types(name),
          addresses(street_address, city, state_code)
        `)
        .eq("status", "active")
        .eq("approval_status", "approved")
        .order("warranty_end", { ascending: false });

      if (error) throw error;

      // Filtrar apenas garantias que ainda não venceram
      return data.filter(warranty => {
        const endDate = parseISO(warranty.warranty_end);
        return isAfter(endDate, new Date());
      });
    },
  });

  const handleServiceRequest = async (warrantyId: string) => {
    // Implementar depois a lógica de solicitação de serviço
    toast({
      title: "Em breve",
      description: "A solicitação de serviços estará disponível em breve.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-6">
        {/* Seção de Serviços Avulsos */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Serviços Avulsos</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Em Breve
              </CardTitle>
              <CardDescription>
                Em breve você poderá solicitar serviços avulsos, mesmo sem uma garantia ativa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Solicitar Serviço Avulso
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Seção de Garantias Ativas */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Minhas Garantias Ativas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {warranties?.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">
                    Você não possui garantias ativas no momento.
                  </p>
                </CardContent>
              </Card>
            )}

            {warranties?.map((warranty) => (
              <Card key={warranty.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {warranty.warranty_types?.name}
                    </CardTitle>
                    <Badge variant="success" className="capitalize">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Ativa
                    </Badge>
                  </div>
                  <CardDescription>
                    {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleServiceRequest(warranty.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Solicitar Serviço
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;