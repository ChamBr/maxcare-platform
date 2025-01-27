import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Plus, ShieldCheck, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isAfter, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const Services = () => {
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

      return data.filter(warranty => {
        const endDate = parseISO(warranty.warranty_end);
        return isAfter(endDate, new Date());
      });
    },
  });

  const { data: services } = useQuery({
    queryKey: ["warranty-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          warranties (
            id,
            warranty_types (
              name
            )
          ),
          warranty_services (
            name,
            description
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: availableServices } = useQuery({
    queryKey: ["available-warranty-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranty_type_services")
        .select(`
          id,
          max_uses,
          warranty_type_id,
          warranty_services (
            id,
            name,
            description
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Aguardando", variant: "secondary" },
      scheduled: { label: "Agendado", variant: "blue" },
      in_progress: { label: "Em Andamento", variant: "yellow" },
      completed: { label: "Concluído", variant: "green" },
      cancelled: { label: "Cancelado", variant: "destructive" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getAvailableServicesForWarranty = (warrantyTypeId: string) => {
    return availableServices?.filter(service => service.warranty_type_id === warrantyTypeId) || [];
  };

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

                <CardContent>
                  {/* Serviços Disponíveis */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Serviços Disponíveis
                    </h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Serviço</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Usos Máximos</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getAvailableServicesForWarranty(warranty.warranty_type_id!)?.map((service) => (
                            <TableRow key={service.id}>
                              <TableCell>{service.warranty_services.name}</TableCell>
                              <TableCell>{service.warranty_services.description}</TableCell>
                              <TableCell>{service.max_uses}</TableCell>
                            </TableRow>
                          ))}
                          {!getAvailableServicesForWarranty(warranty.warranty_type_id!)?.length && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground">
                                Nenhum serviço disponível
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Serviços Solicitados */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Serviços Solicitados
                    </h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Serviço</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {services
                            ?.filter(service => service.warranty_id === warranty.id)
                            .map(service => (
                              <TableRow key={service.id}>
                                <TableCell>{service.warranty_services?.name}</TableCell>
                                <TableCell>
                                  {service.scheduled_date 
                                    ? format(parseISO(service.scheduled_date), "dd/MM/yyyy")
                                    : format(parseISO(service.created_at), "dd/MM/yyyy")}
                                </TableCell>
                                <TableCell>{getStatusBadge(service.status)}</TableCell>
                              </TableRow>
                            ))}
                          {!services?.some(service => service.warranty_id === warranty.id) && (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground">
                                Nenhum serviço solicitado
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>

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