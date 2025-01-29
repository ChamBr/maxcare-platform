import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface ServiceRequestRowProps {
  request: ServiceRequest;
  onStatusUpdate: (requestId: string, newStatus: string) => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary";
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

export const ServiceRequestRow = ({ request, onStatusUpdate }: ServiceRequestRowProps) => {
  return (
    <TableRow key={request.id}>
      <TableCell>
        {new Date(request.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{request.user.full_name || "N/A"}</p>
          <p className="text-sm text-gray-500">{request.user.email}</p>
        </div>
      </TableCell>
      <TableCell>{request.service_type}</TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(request.status)}>
          {request.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusUpdate(request.id, "approved")}
            disabled={request.status === "approved"}
          >
            Aprovar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusUpdate(request.id, "rejected")}
            disabled={request.status === "rejected"}
          >
            Rejeitar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};