import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageWrapper } from "@/components/layout/PageWrapper";

interface Service {
  id: string;
  service_type: string;
  status: string;
  scheduled_date: string | null;
  completed_date: string | null;
  warranties: {
    warranty_types: {
      name: string;
    };
  };
  users: {
    full_name: string;
    email: string;
  };
}

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          id,
          service_type,
          status,
          scheduled_date,
          completed_date,
          warranties (
            warranty_types (
              name
            )
          ),
          users (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Service[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "blue";
      case "completed":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <PageWrapper showBreadcrumbs title="Serviços">
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))
        ) : (
          services?.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    {service.warranties.warranty_types.name}
                  </CardTitle>
                  <Badge variant={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <p><strong>Cliente:</strong> {service.users.full_name}</p>
                  <p><strong>Tipo de Serviço:</strong> {service.service_type}</p>
                  {service.scheduled_date && (
                    <p>
                      <strong>Data Agendada:</strong>{" "}
                      {format(new Date(service.scheduled_date), "PPP", { locale: ptBR })}
                    </p>
                  )}
                  {service.completed_date && (
                    <p>
                      <strong>Data Concluída:</strong>{" "}
                      {format(new Date(service.completed_date), "PPP", { locale: ptBR })}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageWrapper>
  );
};

export default Services;