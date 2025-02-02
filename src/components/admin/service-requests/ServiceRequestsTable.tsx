
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceRequestRow } from "./ServiceRequestRow";
import { Service } from "@/types/services";

interface ServiceRequestsTableProps {
  requests: Service[];
  onStatusUpdate: (requestId: string, newStatus: string) => void;
}

export const ServiceRequestsTable = ({ requests, onStatusUpdate }: ServiceRequestsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo de Serviço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <ServiceRequestRow
              key={request.id}
              request={request}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
