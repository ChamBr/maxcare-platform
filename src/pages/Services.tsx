import { useQuery } from "@tanstack/react-query";
import { Clock, Plus, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isAfter, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";

const Services = () => {
  const { toast } = useToast();

  const { data: warranties } = useQuery({
    queryKey: ["active-warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          *,
          warranty_types(
            id,
            name
          ),
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-6">
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
                    <Badge variant="green" className="capitalize">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Ativa
                    </Badge>
                  </div>
                  <CardDescription>
                    {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Solicitar Serviço
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Solicitar Serviço</DialogTitle>
                      </DialogHeader>
                      <ServiceRequestForm warrantyId={warranty.id} warrantyTypeId={warranty.warranty_type_id} />
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

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
      </div>
    </div>
  );
};

export default Services;