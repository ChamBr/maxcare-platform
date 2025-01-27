import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Service } from "@/types/services";

interface WarrantyRequestedServicesTableProps {
  services: Service[];
}

export const WarrantyRequestedServicesTable = ({ services }: WarrantyRequestedServicesTableProps) => {
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

  return (
    <div className="rounded-md border min-w-[600px] md:min-w-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Serviço</TableHead>
            <TableHead className="whitespace-nowrap">Data</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.warranty_services?.name}</TableCell>
              <TableCell className="whitespace-nowrap">
                {service.scheduled_date 
                  ? format(parseISO(service.scheduled_date), "dd/MM/yyyy", { locale: ptBR })
                  : format(parseISO(service.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>{getStatusBadge(service.status)}</TableCell>
            </TableRow>
          ))}
          {!services.length && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Nenhum serviço solicitado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};