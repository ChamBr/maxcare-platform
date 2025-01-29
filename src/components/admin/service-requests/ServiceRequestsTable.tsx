import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceRequestRow } from "./ServiceRequestRow";

interface ServiceRequest {
  id: string;
  created_at: string;
  service_type: string;
  status: string;
  user: {
    full_name: string | null;
    email: string;
  };
}

interface ServiceRequestsTableProps {
  requests: ServiceRequest[];
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