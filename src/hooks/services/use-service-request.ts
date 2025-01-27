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
        throw new Error("Usuário não autenticado");
      }

      const selectedService = availableServices.find(s => s.warranty_services.id === values.serviceType);
      
      if (!selectedService) {
        throw new Error("Serviço selecionado não encontrado");
      }

      // Verificamos se o usuário pode solicitar este serviço
      const { data: canRequest, error: checkError } = await supabase
        .rpc('can_request_service', {
          p_warranty_id: warrantyId,
          p_warranty_service_id: values.serviceType
        });

      if (checkError) throw checkError;

      if (!canRequest) {
        throw new Error("Limite de solicitações excedido para este serviço");
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

      navigate("/services");
    } catch (error: any) {
      console.error("Erro na solicitação de serviço:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onSubmit,
  };
};