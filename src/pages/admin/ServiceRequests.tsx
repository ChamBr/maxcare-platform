import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ServiceRequest {
  id: string;
  created_at: string;
  service_type: string;
  status: string;
  user_id: string;
  user: {
    full_name: string | null;
    email: string;
  };
}

const ServiceRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAccess();
    fetchServiceRequests();
  }, []);

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!roles || (roles.role !== "dev" && roles.role !== "admin")) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  };

  const fetchServiceRequests = async () => {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        user:user_id (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar solicitações de serviço.",
        variant: "destructive",
      });
      return;
    }

    setRequests(data);
    setIsLoading(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    const { error } = await supabase
      .from("services")
      .update({ status: newStatus })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da solicitação.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Status atualizado com sucesso.",
    });

    fetchServiceRequests();
  };

  const filteredRequests = requests.filter(request => 
    request.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <PageWrapper showBreadcrumbs>Carregando...</PageWrapper>;
  }

  return (
    <PageWrapper showBreadcrumbs>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Buscar por nome, email ou tipo de serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

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
              {filteredRequests.map((request) => (
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
                        onClick={() => handleStatusUpdate(request.id, "approved")}
                        disabled={request.status === "approved"}
                      >
                        Aprovar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(request.id, "rejected")}
                        disabled={request.status === "rejected"}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ServiceRequests;