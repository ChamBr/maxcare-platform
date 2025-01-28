import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Service } from "@/types/services";

interface WarrantyRequestedServicesTableProps {
  services: Service[];
}

export const WarrantyRequestedServicesTable = ({ services }: WarrantyRequestedServicesTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" },
      scheduled: { label: "Scheduled", variant: "blue" },
      in_progress: { label: "In Progress", variant: "yellow" },
      completed: { label: "Completed", variant: "green" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Service</TableHead>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.warranty_services?.name}</TableCell>
              <TableCell className="whitespace-nowrap">
                {service.scheduled_date 
                  ? format(parseISO(service.scheduled_date), "MM/dd/yyyy")
                  : format(parseISO(service.created_at), "MM/dd/yyyy")}
              </TableCell>
              <TableCell>{getStatusBadge(service.status)}</TableCell>
            </TableRow>
          ))}
          {!services.length && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No services requested
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};