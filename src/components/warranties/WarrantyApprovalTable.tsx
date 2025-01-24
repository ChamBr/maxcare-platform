import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, Home, Building } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Warranty {
  id: string;
  created_at: string;
  approval_status: string;
  users: {
    full_name: string | null;
    email: string;
  };
  addresses: {
    street_address: string;
    city: string;
    state_code: string;
    address_type: string;
  } | null;
  warranty_types: {
    name: string;
  } | null;
}

interface WarrantyApprovalTableProps {
  warranties: Warranty[];
  onApprovalUpdate: () => void;
}

export const WarrantyApprovalTable = ({
  warranties,
  onApprovalUpdate,
}: WarrantyApprovalTableProps) => {
  const handleApproval = async (warrantyId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from("warranties")
        .update({
          approval_status: approved ? "approved" : "rejected",
          approved_at: new Date().toISOString(),
          approved_by_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", warrantyId);

      if (error) throw error;

      toast.success(
        approved
          ? "Garantia aprovada com sucesso"
          : "Garantia rejeitada com sucesso"
      );
      onApprovalUpdate();
    } catch (error) {
      console.error("Erro ao atualizar garantia:", error);
      toast.error("Erro ao processar a solicitação");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovada</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getAddressIcon = (addressType: string | undefined) => {
    switch (addressType) {
      case "business":
        return <Building className="h-4 w-4 inline-block mr-2" />;
      default:
        return <Home className="h-4 w-4 inline-block mr-2" />;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {warranties.map((warranty) => (
          <TableRow key={warranty.id}>
            <TableCell>
              {format(new Date(warranty.created_at), "Pp", { locale: ptBR })}
            </TableCell>
            <TableCell>
              {warranty.users.full_name || warranty.users.email}
            </TableCell>
            <TableCell>{warranty.warranty_types?.name || "N/A"}</TableCell>
            <TableCell>
              {warranty.addresses ? (
                <span className="flex items-center">
                  {getAddressIcon(warranty.addresses.address_type)}
                  {warranty.addresses.street_address}, {warranty.addresses.city} - {warranty.addresses.state_code}
                </span>
              ) : (
                "Endereço não informado"
              )}
            </TableCell>
            <TableCell>{getStatusBadge(warranty.approval_status)}</TableCell>
            <TableCell>
              {warranty.approval_status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => handleApproval(warranty.id, true)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleApproval(warranty.id, false)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};