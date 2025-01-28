import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WarrantyServicesTableProps {
  services: Array<{
    id: string;
    warranty_services: {
      id: string;
      name: string;
      description: string;
    };
    max_uses: number;
  }>;
  warrantyId: string;
}

export const WarrantyServicesTable = ({ services, warrantyId }: WarrantyServicesTableProps) => {
  const isMobile = useIsMobile();

  // Fetch service requests for this warranty
  const { data: requestedServices } = useQuery({
    queryKey: ["warranty-requested-services", warrantyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("warranty_service_id, status")
        .eq("warranty_id", warrantyId)
        .neq("status", "cancelled");

      if (error) throw error;
      return data;
    },
  });

  // Calculate service usage
  const getServiceUsage = (serviceId: string) => {
    if (!requestedServices) return 0;
    return requestedServices.filter(
      service => service.warranty_service_id === serviceId && 
      ["pending", "scheduled", "in_progress", "completed"].includes(service.status)
    ).length;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Service</TableHead>
            {!isMobile && (
              <TableHead className="whitespace-nowrap">Description</TableHead>
            )}
            <TableHead className="whitespace-nowrap text-center">Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => {
            const usedServices = getServiceUsage(service.warranty_services.id);
            const availableServices = service.max_uses - usedServices;

            return (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.warranty_services.name}</TableCell>
                {!isMobile && (
                  <TableCell>{service.warranty_services.description}</TableCell>
                )}
                <TableCell className="text-center">{`${availableServices}/${service.max_uses}`}</TableCell>
              </TableRow>
            );
          })}
          {!services.length && (
            <TableRow>
              <TableCell colSpan={isMobile ? 2 : 3} className="text-center text-muted-foreground">
                No services available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};