import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const formSchema = z.object({
  serviceType: z.string().min(1, "Por favor selecione um tipo de serviço"),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const useServiceRequest = (warrantyId: string, warrantyTypeId: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: availableServices = [] } = useQuery({
    queryKey: ["available-services", warrantyId, warrantyTypeId],
    queryFn: async () => {
      const { data: typeServices, error: typeError } = await supabase
        .from('warranty_type_services')
        .select(`
          id,
          max_uses,
          warranty_services (
            id,
            name
          )
        `)
        .eq('warranty_type_id', warrantyTypeId);

      if (typeError) throw typeError;

      const { data: requestedServices, error: requestError } = await supabase
        .from('services')
        .select('warranty_service_id, status')
        .eq('warranty_id', warrantyId)
        .neq('status', 'cancelled');

      if (requestError) throw requestError;

      const serviceUsageCounts = requestedServices.reduce((acc: Record<string, number>, service) => {
        if (service.warranty_service_id) {
          acc[service.warranty_service_id] = (acc[service.warranty_service_id] || 0) + 1;
        }
        return acc;
      }, {});

      return typeServices.filter(typeService => {
        const usageCount = serviceUsageCounts[typeService.warranty_services.id] || 0;
        return usageCount < typeService.max_uses;
      });
    },
    enabled: !!warrantyTypeId,
  });

  const onSubmit = async (values: FormValues) => {
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

      const { error } = await supabase
        .from("services")
        .insert({
          user_id: user.id,
          warranty_id: warrantyId,
          warranty_service_id: values.serviceType,
          service_type: availableServices.find(s => s.warranty_services.id === values.serviceType)?.warranty_services.name || '',
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
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar solicitação de serviço. Por favor, tente novamente.",
      });
      console.error("Service request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    availableServices,
    onSubmit,
    formSchema,
  };
};