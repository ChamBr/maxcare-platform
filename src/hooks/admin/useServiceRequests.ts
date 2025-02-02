
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@/types/services";

export const useServiceRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        id,
        warranty_id,
        user_id,
        service_type,
        status,
        scheduled_date,
        completed_date,
        notes,
        created_at,
        updated_at,
        warranty_service_id,
        users (
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

  useEffect(() => {
    checkAccess();
    fetchServiceRequests();
  }, []);

  const filteredRequests = requests.filter(request => 
    request.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    isLoading,
    searchTerm,
    setSearchTerm,
    filteredRequests,
    handleStatusUpdate
  };
};
