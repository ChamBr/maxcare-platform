import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceFormValues } from "./types";

interface UseServiceSubmissionProps {
  warrantyId: string;
  availableServices: Array<{
    warranty_services: {
      id: string;
      name: string;
    };
  }>;
}

export const useServiceSubmission = ({ warrantyId, availableServices }: UseServiceSubmissionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: ServiceFormValues) => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro de Autenticação",
          description: "Por favor, faça login para solicitar um serviço.",
        });
        return;
      }

      const selectedService = availableServices.find(s => s.warranty_services.id === values.serviceType);
      
      if (!selectedService) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Serviço selecionado não encontrado.",
        });
        return;
      }

      // Primeiro verificamos se o usuário pode solicitar este serviço
      const { data: canRequest, error: checkError } = await supabase
        .rpc('can_request_service', {
          p_warranty_id: warrantyId,
          p_warranty_service_id: values.serviceType
        });

      if (checkError) throw checkError;

      if (!canRequest) {
        toast({
          variant: "destructive",
          title: "Limite Excedido",
          description: "Você já atingiu o limite de solicitações para este serviço.",
        });
        return;
      }

      const { error } = await supabase
        .from("services")
        .insert({
          user_id: user.id,
          warranty_id: warrantyId,
          warranty_service_id: values.serviceType,
          service_type: selectedService.warranty_services.name,
          notes: values.notes,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua solicitação de serviço foi enviada.",
      });
      
      navigate("/services");
    } catch (error: any) {
      console.error("Service request error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar solicitação de serviço. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onSubmit,
  };
};